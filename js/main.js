document.addEventListener('DOMContentLoaded', function () {
  var gnb = document.getElementById('gnb');
  var menuToggle = document.getElementById('menuToggle');
  var menuClose = document.getElementById('menuClose');
  var mobileNav = document.getElementById('mobileNav');
  var gnbOverlay = document.getElementById('gnbOverlay');

  function closeMenu() {
    gnb.classList.remove('active');
    gnbOverlay.classList.remove('active');
    menuToggle.style.display = '';
    menuClose.style.display = 'none';
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', function () {
    if (window.innerWidth <= 768) {
      mobileNav.classList.toggle('active');
    } else {
      var isActive = gnb.classList.toggle('active');
      gnbOverlay.classList.toggle('active', isActive);
      menuToggle.style.display = isActive ? 'none' : '';
      menuClose.style.display = isActive ? '' : 'none';
      document.body.style.overflow = isActive ? 'hidden' : '';
    }
  });

  menuClose.addEventListener('click', closeMenu);
  gnbOverlay.addEventListener('click', closeMenu);

  // 구독 희망일 최소값 설정 (오늘 이후)
  var startDate = document.getElementById('startDate');
  if (startDate) {
    var today = new Date().toISOString().split('T')[0];
    startDate.setAttribute('min', today);
  }

  // 신청인 정보와 동일 체크
  var sameCheck = document.getElementById('sameAsApplicant');
  if (sameCheck) {
    sameCheck.addEventListener('change', function () {
      if (this.checked) {
        document.getElementById('rcvName').value = document.getElementById('appName').value;
        document.getElementById('rcvPhone').value = document.getElementById('appPhone').value;
        document.getElementById('rcvEmail').value = document.getElementById('appEmail').value;
      } else {
        document.getElementById('rcvName').value = '';
        document.getElementById('rcvPhone').value = '';
        document.getElementById('rcvEmail').value = '';
      }
    });
  }

  // 구독료 계산
  var periodRadios = document.querySelectorAll('input[name="period"]');
  var copiesSelect = document.getElementById('copies');
  var totalPrice = document.getElementById('totalPrice');
  if (periodRadios.length && copiesSelect && totalPrice) {
    function calcPrice() {
      var period = document.querySelector('input[name="period"]:checked');
      var months = period ? parseInt(period.value) : 0;
      var copies = parseInt(copiesSelect.value);
      var price = 12000 * months * copies;
      totalPrice.textContent = price.toLocaleString() + '원';
    }
    periodRadios.forEach(function (r) { r.addEventListener('change', calcPrice); });
    copiesSelect.addEventListener('change', calcPrice);
  }

  // 폼 제출
  var form = document.getElementById('subscribeForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var checks = [
        { id: 'privacyAgree', type: 'checkbox', msg: '개인정보보호를 위한 이용자 동의사항에 동의해주세요.' },
        { id: 'appName', msg: '성명을 입력해주세요.' },
        { id: 'appBirth', msg: '생년월일을 6자리로 입력해주세요.' },
        { id: 'appPhone', msg: '전화번호를 올바르게 입력해주세요.' },
        { id: 'appEmail', msg: '이메일을 올바르게 입력해주세요.' },
        { id: 'zipCode', msg: '주소를 입력해주세요.' },
        { id: 'startDate', msg: '구독 희망일을 선택해주세요.' }
      ];

      for (var i = 0; i < checks.length; i++) {
        var el = document.getElementById(checks[i].id);
        if (!el) continue;
        if (checks[i].type === 'checkbox') {
          if (!el.checked) { alert(checks[i].msg); el.focus(); return; }
        } else if (!el.value || !el.validity.valid) {
          alert(checks[i].msg); el.focus(); return;
        }
      }

      var submitBtn = document.getElementById('btnSubscribe');
      submitBtn.disabled = true;
      submitBtn.textContent = '제출 중...';

      var period = document.querySelector('input[name="period"]:checked');
      var data = {
        appName: document.getElementById('appName').value,
        appBirth: document.getElementById('appBirth').value,
        appPhone: document.getElementById('appPhone').value,
        appEmail: document.getElementById('appEmail').value,
        rcvName: document.getElementById('rcvName').value,
        rcvPhone: document.getElementById('rcvPhone').value,
        rcvEmail: document.getElementById('rcvEmail').value,
        zipCode: document.getElementById('zipCode').value,
        baseAddr: document.getElementById('baseAddr').value,
        detailAddr: document.getElementById('detailAddr').value,
        period: period ? period.value + '개월' : '',
        copies: document.getElementById('copies').value + '부',
        totalPrice: document.getElementById('totalPrice').textContent,
        startDate: document.getElementById('startDate').value
      };

      var scriptUrl = 'https://script.google.com/macros/s/AKfycbxFbOEyfTuD_FjXM_EY7HTKdMKkhGfXu9qlzP0Iz_OBh9nCQTgWIbDMAzycL_jWmFIhWw/exec';
      var iframe = document.createElement('iframe');
      iframe.name = 'gas-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      var hiddenForm = document.createElement('form');
      hiddenForm.method = 'POST';
      hiddenForm.action = scriptUrl;
      hiddenForm.target = 'gas-iframe';

      Object.keys(data).forEach(function (key) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        hiddenForm.appendChild(input);
      });

      document.body.appendChild(hiddenForm);
      hiddenForm.submit();

      iframe.addEventListener('load', function () {
        alert('구독신청이 완료되었습니다.');
        form.reset();
        document.getElementById('totalPrice').textContent = '12,000원';
        document.querySelector('input[name="period"][value="1"]').checked = true;
        submitBtn.disabled = false;
        submitBtn.textContent = '구독신청';
        document.body.removeChild(iframe);
        document.body.removeChild(hiddenForm);
      });
    });
  }

  // 카카오 우편번호 검색
  var btnAddrSearch = document.getElementById('btnAddrSearch');
  if (btnAddrSearch) {
    btnAddrSearch.addEventListener('click', function () {
      new daum.Postcode({
        oncomplete: function (data) {
          document.getElementById('zipCode').value = data.zonecode;
          document.getElementById('baseAddr').value = data.address;
          document.getElementById('detailAddr').focus();
        }
      }).open();
    });
  }
});
