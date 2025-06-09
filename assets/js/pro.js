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
  $('input[name="sum"]').on("input", function () {
    $('input[name="price_copy"]').val($(this).val() + " ₽");
  });
  $('input[name="cargo_sum"]').on("input", function () {
    $('input[name="advert_price_copy"]').val($(this).val() + " ₽");
  });
  // tourfirm
  $(".tourfirm_tab_btns input[name='tourfirm_type_btn']").on(
    "change",
    function () {
      $('input[name="tourfirm_car_copy"]').val("");
      $('input[name="price_copy"]').val("");
      $('input[name="cargo_sum"]').val("");
      $('input[name="advert_price_copy"]').val("");
      $('input[name="tourfirm_type_copy"]').val($(this).val());
    }
  );
  $(".tourfirm_tabs input[name='tourfirm_type']").on("change", function () {
    $('input[name="tourfirm_car_copy"]').val($(this).val());
  });
  $('input[name="weight"],input[name="weight"]').on("input", function () {
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
  $('.services_items input[type="checkbox"]').on("change", function () {
    // Tanlangan checkboxlarning qiymatlarini olish
    let selected = $('.services_items input[type="checkbox"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get()
      .join(", ");
    $(".sidebar_service input").val(selected);
  });
  $('.cargo_calculation_header input[type="checkbox"]').on(
    "change",
    function () {
      // Tanlangan checkboxlarning qiymatlarini olish
      let selected = $(
        '.cargo_calculation_header input[type="checkbox"]:checked'
      );
      if (selected) {
        $(".cargo_info_inputs.last").slideUp();
        $(".cargo_calculation_items").slideDown();
      }
      if (!selected) {
        $(".cargo_info_inputs.last").slideDown();
        $(".cargo_calculation_items").slideUp();
      }
    }
  );
  let counter = 1;

  function updateBlocks() {
    $(".cargo_calculation_items .cargo_info_inputs").each(function (index) {
      const num = index + 1;
      $(this)
        .find(".cargo_calculation_items .cargo_calculation_number")
        .text(num);
      $(this)
        .find('input[name^="size"]')
        .attr("name", "size" + num);
      $(this)
        .find('input[name^="weight"]')
        .attr("name", "weight" + num);
      $(this)
        .find('input[name^="sum"]')
        .attr("name", "sum" + num);
    });

    // Agar 2+ blok bo‘lsa, o‘chirish tugmasini ko‘rsatamiz
    if ($(".cargo_calculation_items .cargo_info_inputs").length > 1) {
      $(".cargo_calculation_items .remove_input_btn").show();
    } else {
      $(".cargo_calculation_items .remove_input_btn").hide();
    }
  }

  $(".cargo_calculation_items .add_input_btn").on("click", function (e) {
    e.preventDefault();
    counter++;

    const newBlock = $(`
      <div class="cargo_info_inputs">
        <div class="cargo_calculation_number">${counter}</div>
        <div class="cargo_info_input">
          <input type="text" placeholder="Габариты (ДхШхВ), м" name="size_input${counter}">
        </div>
        <div class="cargo_info_input">
          <input type="number" placeholder="Объем, м3" name="wolume_input${counter}">
        </div>
        <div class="cargo_info_input">
          <input type="number" placeholder="Вес, кг" name="weight_input${counter}">
        </div>
        <div class="cargo_info_input">
        <input type="number" placeholder="Количество мест" name="counter_input"/>
        </div>
      </div>`);

    $(".cargo_calculation_items .cargo_info_inputs").last().after(newBlock);
    updateBlocks();
  });

  $(".cargo_calculation_items .remove_input_btn").on("click", function (e) {
    e.preventDefault();
    if ($(".cargo_calculation_items .cargo_info_inputs").length > 1) {
      $(".cargo_calculation_items .cargo_info_inputs").last().remove();
      counter = $(".cargo_calculation_items .cargo_info_inputs").length;
      updateBlocks();
    }
  });
  updateBlocks();
  // tab content
  $(".tourfirm_tab_content").fadeOut();
  $(".tourfirm_tab_content#tab_content1").fadeIn();

  $('input[name="tourfirm_type_btn"]').on("change", function () {
    const value = $(this).val();
    let targetId = "";
    switch (value) {
      case "Еврофура":
        targetId = "#tab_content1";
        break;
      case "Прямая машина":
        targetId = "#tab_content2";
        break;
      case "Сборный груз":
        targetId = "#tab_content3";
        break;
      case "Контейнер":
        targetId = "#tab_content4";
        break;
      case "Негабарит":
        targetId = "#tab_content5";
        break;
    }
    // Agar tanlangan content hozir ko‘rsatilayotgan bo‘lsa, hech narsa qilmaymiz
    if (!$(targetId).is(":visible")) {
      $(".tourfirm_tab_content:visible").fadeOut(200, function () {
        $(targetId).fadeIn(200);
      });
    }
  });
  // header
  $(".header_hamburger").click(function () {
    $("body").toggleClass("lock");
    $(this).toggleClass("active");
    $(".header_mobile").toggleClass("open");
  });
  // datepicker
  if ($("#loading_date").length > 0) {
    $("#loading_date").datepicker({
      dateFormat: "dd.mm.yy", // yoki 'yy-mm-dd'
      changeMonth: true,
      changeYear: true,
    });
  }
  // tel inputmask
  if ($('input[type="tel"]').length > 0) {
    $('input[type="tel"]').inputmask({
      mask: "+7 (999) 999-99-99",
      placeholder: "_",
      showMaskOnHover: false,
      showMaskOnFocus: true,
    });
  }
  // datepicker parent
  $(".date_wrapper").on("click", function () {
    $("#loading_date").datepicker("show").focus();
  });
  // emali validate
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  // phone validate
  function isValidPhone(phone) {
    return /^\d{9,15}$/.test(phone);
  }
  // input validate
  $(".sender_info_input").on("input", function () {
    const $input = $(this);
    const value = $input.val().trim();
    const $row = $input.closest(".sender_info_row");
    const name = $input.attr("name");
    let isValid = false;

    if (name === "sender_email") {
      isValid = isValidEmail(value);
    } else if (name === "sender_phone") {
      isValid = isValidPhone(value);
    } else {
      isValid = value.length >= 2;
    }

    if (isValid) {
      $row.addClass("valid");
    } else {
      $row.removeClass("valid");
    }
  });

  // modal close
  $(".close_btn").click(function (e) {
    e.preventDefault();
    $(this).closest(".modal").fadeOut();
  });
  // edit open
  $(".edit_content .open_edit").click(function () {
    $(this).next(".edit_btns").slideToggle();
  });
  // edit modal open
  $(".edit_btns .edit").click(function () {
    $(".edit_btns").fadeOut();
    $(this).closest(".edit_btns").slideUp();
    $(".modal#edit").fadeIn();
  });
  // modal exit
  $(".otmen").click(function (e) {
    e.preventDefault();
    $(".modal").fadeOut();
  });
  // open modal add location
  $(".add_adress").click(function (e) {
    e.preventDefault();
    $(".modal#add_adress").fadeIn();
  });
  // open delete
  $(".edit_btn.delete").click(function (e) {
    e.preventDefault();
    $(".modal#delete").fadeIn();
  });
  // QUIZ
  $(".quiz_item").fadeOut(0);
  $(".quiz_item:first").fadeIn();

  let currentStep = 0;

  function showStep(index) {
    const $items = $(".quiz_item");
    const $buttons = $(".quiz_progress_btn");
    const $dots = $(".progress_dots");

    $items.removeClass("active").fadeOut(0);
    $items.eq(index).fadeIn(200).addClass("active");
    $buttons.eq(index).addClass("active");
    $dots.eq(index).addClass("active");
    // Tugma type ni tekshirish
    const $btn = $(".profile_btn.next");
    if (index === $items.length - 1) {
      $btn.attr("type", "submit").text("Завершить");
    } else {
      $btn.attr("type", "button").text("Далее");
    }
  }

  $(".profile_btn.next").on("click", function () {
    const $items = $(".quiz_item");
    if (currentStep < $items.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });

  // Forma submit
  $("#quiz_form").on("submit", function (e) {
    e.preventDefault();
    // Yoki AJAX yuborish logikasi shu yerga yoziladi
  });
  if ($(".filters select.nice").length > 0) {
    $(".filters select.nice").niceSelect();
  }
  function datePick() {
    // Sana tanlash funksiyasi
    $("#start_date").datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: function () {
        let minDate = $(this).datepicker("getDate");
        $("#end_date").datepicker("option", "minDate", minDate);
        updateDateText();
      },
    });

    $("#end_date").datepicker({
      dateFormat: "dd/mm/yy",
      onSelect: function () {
        let maxDate = $(this).datepicker("getDate");
        $("#start_date").datepicker("option", "maxDate", maxDate);
        updateDateText();
      },
    });

    // Ochish/tugatish
    $(".date_range .custom-select, .select-wrapper.date_range img").on(
      "click",
      function (e) {
        $(".date_picker_popup").toggle();
        e.stopPropagation();
      }
    );

    // Tashqariga bosilganda yopish (lekin datepicker yoki popup ichida bosilsa yopilmaydi)
    $(document).on("click", function (e) {
      if (
        !$(e.target).closest(".date_picker_popup").length &&
        !$(e.target).closest(".ui-datepicker").length
      ) {
        $(".date_picker_popup").hide();
      }
    });

    // Popup va datepicker bosilganda yopilmasligi uchun
    $(".date_picker_popup").on("click", function (e) {
      e.stopPropagation();
    });

    // Matnni yangilash
    function updateDateText() {
      let start = $("#start_date").val();
      let end = $("#end_date").val();
      if (start && end) {
        $("#date_range_text").text(`${start} - ${end}`);
      }
    }
  }
  datePick();
  function setupCitySelect() {
    const $wrapper = $(".select-wrapper.city");
    const $readonlyInput = $wrapper.find(".custom-select.city_search");
    const $searchInput = $wrapper.find(".search_input");
    const $dropdown = $wrapper.find(".city_list");
    const $checkboxes = $wrapper.find('input[type="checkbox"]');
    const $labels = $wrapper.find("label");

    // ✅ INPUT bosilganda ochiladi
    $readonlyInput.on("click", function (e) {
      e.stopPropagation();
      $dropdown.toggle();
    });

    // 🔍 Qidiruv funksiyasi
    $searchInput.on("input", function () {
      const search = $(this).val().toLowerCase();
      $labels.each(function () {
        const labelText = $(this).text().toLowerCase();
        $(this).toggle(labelText.includes(search));
      });
    });

    // ✅ Tanlanganlar inputga yoziladi
    $checkboxes.on("change", function () {
      const selected = $checkboxes
        .filter(":checked")
        .map(function () {
          return this.value;
        })
        .get()
        .join(", ");
      $readonlyInput.val(selected);
    });

    // ❌ Tashqariga bosilganda dropdown yopiladi
    $(document).on("click", function (e) {
      if (!$wrapper.is(e.target) && $wrapper.has(e.target).length === 0) {
        $dropdown.hide();
      }
    });
  }

  $(document).ready(function () {
    setupCitySelect();
  });
  $(".den_select").niceSelect();
});
