/* ---------------------------------------------------------
   BABA ONLINE ACADEMY — ADMIN PANEL JS
   --------------------------------------------------------- */

(function ($) {

    console.log("BOA Admin JS Loaded ✔");

    /* ---------------------------------------------------------
       GLOBAL UI HELPERS
       --------------------------------------------------------- */

    const BOA_ADMIN = {

        showLoader: function () {
            if ($(".boa-admin-loader").length === 0) {
                $("body").append('<div class="boa-admin-loader"><div class="loader">Loading...</div></div>');
            }
            $(".boa-admin-loader").fadeIn(200);
        },

        hideLoader: function () {
            $(".boa-admin-loader").fadeOut(200);
        },

        ajax: function (action, data, onSuccess, onError) {

            BOA_ADMIN.showLoader();

            $.ajax({
                url: boa_admin.ajax_url,
                method: "POST",
                data: Object.assign({
                    action: action,
                    nonce: boa_admin.nonce
                }, data),

                success: function (response) {
                    BOA_ADMIN.hideLoader();

                    if (response.success) {
                        BOA_ADMIN.toast("Action completed successfully", "success");
                        if (typeof onSuccess === "function") onSuccess(response.data);
                    } else {
                        BOA_ADMIN.toast(response.data.message || "Error", "error");
                        if (typeof onError === "function") onError(response.data);
                    }
                },

                error: function (xhr, status, error) {
                    BOA_ADMIN.hideLoader();
                    console.error(error);
                    BOA_ADMIN.toast("Network error: " + error, "error");
                }
            });
        },

        toast: function (msg, type = "info") {
            if ($("#boa-admin-toast-box").length === 0) {
                $("body").append('<div id="boa-admin-toast-box"></div>');
            }

            let box = $('<div class="boa-admin-toast ' + type + '">' + msg + '</div>');
            $("#boa-admin-toast-box").append(box);

            setTimeout(() => {
                box.fadeOut(300, () => box.remove());
            }, 2500);
        },

        confirm: function (msg, ok) {
            if (confirm(msg)) {
                if (typeof ok === "function") ok();
            }
        }
    };

    /* ---------------------------------------------------------
       AUTO-INJECT TOAST & LOADER CSS
       --------------------------------------------------------- */

    const css = `
        #boa-admin-toast-box {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 999999;
        }
        .boa-admin-toast {
            padding: 12px 18px;
            border-radius: 6px;
            background: var(--boa-primary);
            color: white;
            box-shadow: 0 3px 7px rgba(0,0,0,0.2);
        }
        .boa-admin-toast.error { background:#dc3545; }
        .boa-admin-toast.success { background:#28a745; }

        .boa-admin-loader {
            position: fixed;
            inset: 0;
            background: rgba(255,255,255,0.7);
            display: none;
            align-items:center;
            justify-content:center;
            z-index: 99999;
        }
        .boa-admin-loader .loader {
            background: var(--boa-primary);
            color:white;
            padding:14px 20px;
            border-radius:6px;
        }
    `;

    $("<style>").text(css).appendTo("head");

    /* ---------------------------------------------------------
       SEARCH FILTER
       --------------------------------------------------------- */

    $(document).on("keyup", ".boa-search-input", function () {

        let term = $(this).val().toLowerCase();

        $(".boa-admin-table tbody tr").each(function () {

            $(this).toggle($(this).text().toLowerCase().includes(term));

        });
    });

    /* ---------------------------------------------------------
       DELETE ACTION
       --------------------------------------------------------- */

    $(document).on("click", ".boa-delete-btn", function (e) {
        e.preventDefault();

        let id = $(this).data("id");
        let action = $(this).data("action");

        BOA_ADMIN.confirm("Delete this record?", function () {

            BOA_ADMIN.ajax(action, { id: id }, function () {
                location.reload();
            });

        });
    });

    /* ---------------------------------------------------------
       AJAX FORM SUBMIT
       --------------------------------------------------------- */

    $(document).on("submit", ".boa-admin-form", function (e) {
        e.preventDefault();

        let form = $(this);
        let action = form.data("action");
        let reload = form.data("reload") === true;
        let data = form.serialize();

        BOA_ADMIN.ajax(action, data, function () {
            if (reload) {
                setTimeout(() => location.reload(), 600);
            }
        });
    });

    /* ---------------------------------------------------------
       MODALS
       --------------------------------------------------------- */

    $(document).on("click", ".boa-open-modal", function () {
        let target = $(this).data("target");
        $(target).fadeIn(200);
    });

    $(document).on("click", ".boa-close-modal", function () {
        $(this).closest(".boa-modal").fadeOut(200);
    });

    /* ---------------------------------------------------------
       STATUS TOGGLE
       --------------------------------------------------------- */

    $(document).on("change", ".boa-status-toggle", function () {
        let id = $(this).data("id");
        let action = $(this).data("action");
        let value = $(this).is(":checked") ? 1 : 0;

        BOA_ADMIN.ajax(action, { id: id, value: value });
    });

})(jQuery);
