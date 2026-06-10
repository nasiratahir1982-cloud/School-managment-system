// Admin/Frontend Course Materials JS
(function($) {
    const boaMaterials = window.boa_course_materials_data || {};
    const ajaxUrl = boaMaterials.ajax_url || window.ajaxurl;
    const nonce = boaMaterials.nonce || '';

    window.loadMaterials = function() {
        const courseSelect = document.getElementById('boa-course-filter');
        const courseId = courseSelect.value;
        const listContainer = document.getElementById('boa-materials-list-container');
        const addContainer = document.getElementById('boa-add-material-container');
        const tbody = document.getElementById('boa-materials-tbody');

        if (!courseId) {
            listContainer.style.display = 'none';
            addContainer.style.display = 'none';
            return;
        }

        document.getElementById('boa-material-course-id').value = courseId;
        document.getElementById('boa-materials-course-title').innerText =
            'Materials for ' + courseSelect.options[courseSelect.selectedIndex].text;

        listContainer.style.display = 'block';
        addContainer.style.display = 'block';
        tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_get_course_materials',
                course_id: courseId,
                nonce: nonce
            }
        }).done(function(response) {
            tbody.innerHTML = '';
            if (response.success && response.data.length) {
                response.data.forEach(material => {
                    const row = `
                        <tr>
                            <td data-label="Title">${material.title}</td>
                            <td data-label="Type"><span class="boa-material-pill">${material.material_type}</span></td>
                            <td data-label="Link"><a href="${material.content_url}" target="_blank">View</a></td>
                            <td data-label="Actions">
                                <div class="boa-actions">
                                    <button class="boa-btn boa-btn-sm boa-btn-secondary" onclick="deleteMaterial(${material.material_id})">Delete</button>
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', row);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="4">No materials found.</td></tr>';
            }
        }).fail(function() {
            tbody.innerHTML = '<tr><td colspan="4">Error loading materials.</td></tr>';
        });
    };

    window.addMaterial = function() {
        const courseId = document.getElementById('boa-material-course-id').value;
        const title = document.getElementById('boa-material-title').value;
        const type = document.getElementById('boa-material-type').value;
        const url = document.getElementById('boa-material-url').value;
        const description = document.getElementById('boa-material-description').value;

        if (!courseId || !title || !type) {
            alert('Please fill all required fields.');
            return false;
        }

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_add_course_material',
                course_id: courseId,
                title: title,
                material_type: type,
                content_url: url,
                description: description,
                nonce: nonce
            }
        }).done(function(response) {
            if (response.success) {
                alert('Material added successfully.');
                document.getElementById('boa-add-material-form').reset();
                loadMaterials();
            } else {
                alert(response.data || 'Failed to add material.');
            }
        }).fail(function() {
            alert('Error adding material.');
        });

        return false;
    };

    window.deleteMaterial = function(materialId) {
        if (!confirm('Delete this material?')) return;

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: {
                action: 'boa_delete_course_material',
                material_id: materialId,
                nonce: nonce
            }
        }).done(function(response) {
            if (response.success) {
                loadMaterials();
            } else {
                alert(response.data || 'Failed to delete material.');
            }
        }).fail(function() {
            alert('Error deleting material.');
        });
    };

    $(document).ready(function() {
        loadMaterials();
    });
})(jQuery);
