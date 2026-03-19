document.addEventListener('DOMContentLoaded', function () {
  const mega = document.getElementById('gnbMega');
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileNav = document.getElementById('mobileNav');

  menuToggle.addEventListener('click', function () {
    if (window.innerWidth <= 768) {
      mobileNav.classList.toggle('active');
    } else {
      mega.classList.toggle('active');
      menuToggle.style.display = mega.classList.contains('active') ? 'none' : '';
      menuClose.style.display = mega.classList.contains('active') ? '' : 'none';
    }
  });

  menuClose.addEventListener('click', function () {
    mega.classList.remove('active');
    menuToggle.style.display = '';
    menuClose.style.display = 'none';
  });

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
      if (!form.reportValidity()) return;

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
