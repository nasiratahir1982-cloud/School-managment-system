/* ---------------------------------------------------------
   BABA ONLINE ACADEMY — FRONTEND JS
   Works for:
   - Admission Form
   - Application Status
   - Student Login
   - Student Dashboard
   - Public Live Sessions
   - Certificate Verification
   --------------------------------------------------------- */

(function ($) {

    console.log("BOA Frontend Loaded ✔");

    /* ---------------------------------------------------------
       GLOBAL HELPER FUNCTIONS
       --------------------------------------------------------- */

    const BOA = {

        // Show loader during AJAX actions
        showLoader: function () {
            if ($(".boa-loader").length === 0) {
                $("body").append('<div class="boa-loader">Loading...</div>');
            }
            $(".boa-loader").fadeIn(200);
        },

        hideLoader: function () {
            $(".boa-loader").fadeOut(200);
        },

        // General AJAX helper
        ajax: function (action, data, successCallback, errorCallback) {
            BOA.showLoader();

            $.ajax({
                url: boa_public.ajax_url,
                method: "POST",
                data: Object.assign({
                    action: action,
                    nonce: boa_public.nonce
                }, data),
                success: function (response) {
                    BOA.hideLoader();

                    if (response.success) {
                        if (typeof successCallback === "function") successCallback(response.data);
                    } else {
                        if (typeof errorCallback === "function") errorCallback(response.data);
                        else BOA.toast(response.data.message || "Something went wrong", "error");
                    }
                },
                error: function (xhr, status, error) {
                    BOA.hideLoader();
                    console.error(error);
                    BOA.toast("Network error: " + error, "error");
                }
            });
        },

        // Toast Message UI
        toast: function (msg, type = "info") {
            if ($("#boa-toast-box").length === 0) {
                $("body").append('<div id="boa-toast-box"></div>');
            }

            let g = $("#boa-toast-box");
            let c = $("<div class='boa-toast " + type + "'>" + msg + "</div>");

            g.append(c);
            setTimeout(() => c.fadeOut(400, () => c.remove()), 3000);
        }
    };

    /* ---------------------------------------------------------
       RENDER TOAST CSS (Automatically inserted)
       --------------------------------------------------------- */
    const toastCSS = `
        #boa-toast-box {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .boa-toast {
            padding: 12px 18px;
            background: #1051BC;
            color: #fff;
            border-radius: 6px;
            box-shadow: 0px 3px 7px rgba(0,0,0,0.2);
            font-size: 14px;
            animation: boaFadeIn 0.2s ease;
        }
        .boa-toast.error { background: #dc3545; }
        .boa-toast.success { background: #28a745; }
        @keyframes boaFadeIn { from { opacity:0; } to { opacity:1; } }
        .boa-loader {
            position: fixed;
            background: rgba(255,255,255,0.7);
            top: 0; left: 0; width: 100%; height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 22px;
            color: #1051BC;
            z-index: 9999;
            display: none;
        }
    `;
    $("<style>").text(toastCSS).appendTo("head");

    /* ---------------------------------------------------------
       ADMISSION FORM HANDLING
       --------------------------------------------------------- */
    $(".boa-admission-form").on("submit", function (e) {
        e.preventDefault();

        let form = $(this);
        let formData = form.serialize();

        BOA.ajax("boa_submit_admission", formData,
            function (data) {
                BOA.toast("Admission submitted successfully!", "success");
                form.trigger("reset");
                $(".boa-admission-result").html(
                    `<div class="boa-success-box">
                        <strong>Success!</strong> Your admission ID is <b>${data.admission_id}</b>
                    </div>`
                );
            },
            function (err) {
                BOA.toast(err.message || "Could not submit admission", "error");
            }
        );
    });

    /* ---------------------------------------------------------
       APPLICATION STATUS CHECK
       --------------------------------------------------------- */
    $(".boa-status-check-form").on("submit", function (e) {

        e.preventDefault();
        let formData = $(this).serialize();

        BOA.ajax("boa_check_application_status", formData,
            function (data) {
                $(".boa-status-result").html(`
                    <div class="boa-success-box">
                        <h3>Status: ${data.status}</h3>
                        <p>${data.message}</p>
                    </div>
                `);
            },
            function (err) {
                $(".boa-status-result").html(`
                    <div class="boa-error-box">${err.message}</div>
                `);
            }
        );
    });

    /* ---------------------------------------------------------
       PUBLIC LIVE SESSION EXPAND / COLLAPSE
       --------------------------------------------------------- */
    $(".boa-live-box").on("click", ".toggle-session", function () {

        let block = $(this).closest(".boa-live-box").find(".boa-session-details");
        block.slideToggle(200);
    });

    /* ---------------------------------------------------------
       STUDENT DASHBOARD TABS
       --------------------------------------------------------- */
    $(".boa-tab-btn").on("click", function () {

        let target = $(this).data("tab");

        $(".boa-tab-btn").removeClass("active");
        $(this).addClass("active");

        $(".boa-tab-content").hide();
        $("#" + target).fadeIn(150);
    });

})(jQuery);
