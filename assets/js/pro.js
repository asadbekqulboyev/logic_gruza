$(document).ready(function () {
  $(".toggle_eye").click(function () {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $(this).prev().attr("type", "text");
    } else {
      $(this).prev().attr("type", "password");
    }
  });
  //modal
  $("#register_password").on("input", function () {
    const val = $(this).val();
    const $form = $(this).closest("form");
    const $rules = $(".password_rules li");
    const $button = $form.find("button");

    const checks = [
      /^[A-Za-z0-9!@#\$%\^&\*\(\)\-_=\+]+$/.test(val), // Faqat lotin simvollar
      val.length >= 8, // 8 ta belgidan kam bo'lmasligi
      /(?=.*\d)(?=.*[!@#\$%\^&\*])/.test(val), // Kamida 1 raqam va 1 maxsus belgi
      /(?=.*[a-z])(?=.*[A-Z])/.test(val), // 1 ta kichik va 1 ta katta harf
    ];

    // Har bir qoida bo‘yicha .active klassini qo‘shish/yashirish
    checks.forEach((passed, i) => {
      $rules.eq(i).toggleClass("active", passed);
    });

    // Agar barcha shartlar bajarilgan bo‘lsa, tugmani faollashtirish
    const allPassed = checks.every(Boolean);
    $button.prop("disabled", !allPassed);
  });
  //
  function initCustomSelect(selector) {
    const $container = $(selector);
    const $toggle = $container.find(".select-display");
    const $list = $container.find(".options-list");
    const $text = $container.find("#selectedText");
    const $hiddenInput = $("<input name='region' hidden>").appendTo($container);

    // Ochish-yopish
    $toggle.on("click", function () {
      $list.slideToggle(150);
      $toggle.toggleClass("active");
    });

    // Tanlash
    $list.on("click", "li", function () {
      const shortText = $(this).text();
      const fullValue = $(this).data("value");

      $text.text(fullValue); // Agar soddalashtirilgan nomni ko‘rsatmoqchi bo‘lsang: shortText
      $hiddenInput.val(fullValue);

      $list.slideUp(150);
      $toggle.removeClass("active");
    });

    // Tashqariga bosilsa yopish
    $(document).on("click", function (e) {
      if (!$(e.target).closest(selector).length) {
        $list.slideUp(150);
        $toggle.removeClass("active");
      }
    });
  }

  initCustomSelect(".custom-select");
  // sms texts
  $("#requirements").on("input", function () {
    let maxLength = 200;
    let currentLength = $(this).val().length;
    $(".counter").text(currentLength + "/" + maxLength);
  });
  $('input[name="from"]').on("input", function () {
    $("input[name='from_region']").val($(this).val());
  });
  $('input[name="to"]').on("input", function () {
    $("input[name='to_region']").val($(this).val());
  });
  $(".tourfirm_tab_btns input[name='tourfirm_type_btn']").on("change",
    function(){$('input[name="tourfirm_type_copy"]').val($(this).val());}
  );
  $(".tourfirm_tabs input[name='tourfirm_type']").on("change", function (){
    $('input[name="tourfirm_car_copy"]').val($(this).val());
  });
  $('input[name="weight"]').on("input", function () {
    const val = parseFloat($(this).val());
    if (!isNaN(val)) {
      if (val > 1000) {
        const tons = (val / 1000).toFixed(2); // 2 знака после запятой
        $('input[name="weight_copy"]').val(tons + " т");
      } else {
        $('input[name="weight_copy"]').val(val + " кг");
      }
    } else {
      $('input[name="weight_copy"]').val("");
    }
  });
  
});
