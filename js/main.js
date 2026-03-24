document.addEventListener('DOMContentLoaded', function () {
  var gnb = document.getElementById('gnb');
  var menuToggle = document.getElementById('menuToggle');
  var menuClose = document.getElementById('menuClose');
  var mobileNav = document.getElementById('mobileNav');
  var gnbOverlay = document.getElementById('gnbOverlay');

  function closeMenu() {
    gnb.classList.remove('active');
    gnbOverlay.classList.remove('active');
    mobileNav.classList.remove('active');
    menuToggle.style.display = '';
    menuClose.style.display = 'none';
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', function () {
    if (window.innerWidth <= 1024) {
      var isOpen = mobileNav.classList.toggle('active');
      menuToggle.style.display = isOpen ? 'none' : '';
      menuClose.style.display = isOpen ? '' : 'none';
      document.body.style.overflow = isOpen ? 'hidden' : '';
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

  // GNB 메뉴 클릭 시 사이트맵 열기
  var gnbItems = document.querySelectorAll('.gnb-item > a');
  gnbItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      if (window.innerWidth > 1024) {
        e.preventDefault();
        if (!gnb.classList.contains('active')) {
          gnb.classList.add('active');
          gnbOverlay.classList.add('active');
          menuToggle.style.display = 'none';
          menuClose.style.display = '';
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });

  // 연혁 캐러셀
  var historyTabs = document.querySelectorAll('.history-tab');
  var historyCards = document.querySelectorAll('.history-card');
  var track = document.querySelector('.history-cards-track');
  var prevBtn = document.querySelector('.history-arrow--prev');
  var nextBtn = document.querySelector('.history-arrow--next');

  if (historyTabs.length && track) {
    var allCards = Array.from(historyCards);
    var currentIndex = 0;
    var viewport = document.getElementById('historyViewport');

    function updateCarousel() {
      var cardWidth = allCards.length > 0 ? allCards[0].offsetWidth + 24 : 0;
      track.style.transform = 'translateX(-' + (currentIndex * cardWidth) + 'px)';
      var hasPrev = currentIndex > 0;
      var hasNext = currentIndex < allCards.length - 2;
      prevBtn.disabled = !hasPrev;
      nextBtn.disabled = !hasNext;
      viewport.classList.toggle('no-prev', !hasPrev);
      viewport.classList.toggle('no-next', !hasNext);

      // 현재 보이는 카드의 그룹으로 탭 활성화
      var activeGroup = allCards[currentIndex].dataset.group;
      historyTabs.forEach(function (t) {
        t.classList.toggle('active', t.dataset.group === activeGroup);
      });
    }

    historyTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var group = tab.dataset.group;
        for (var i = 0; i < allCards.length; i++) {
          if (allCards[i].dataset.group === group) {
            currentIndex = i;
            break;
          }
        }
        updateCarousel();
      });
    });

    prevBtn.addEventListener('click', function () {
      if (currentIndex > 0) { currentIndex--; updateCarousel(); }
    });
    nextBtn.addEventListener('click', function () {
      if (currentIndex < allCards.length - 2) { currentIndex++; updateCarousel(); }
    });

    updateCarousel();
  }

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

  // 조직도 (Grid 기반)
  var orgGrid = document.getElementById('orgGrid');
  var orgSvg = document.getElementById('orgSvg');
  if (orgGrid && orgSvg) {
    var connections = [
      { from: 'ceo', to: ['evp'], type: 'straight', delay: 0.15 },
      { from: 'evp', to: ['ailab'], type: 'side', delay: 0.35 },
      { from: 'evp', to: ['mgmt','mkt','edit','aim','reg'], type: 'fork', delay: 0.4 },
      { from: 'edit', to: ['fing','indg'], type: 'fork', delay: 0.75 },
      { from: 'aim', to: ['ae1','ab1','wm'], type: 'fork', delay: 0.78 },
      { from: 'wm', to: ['we1','wb1'], type: 'fork', delay: 1.05 },
      { from: 'fing', to: ['f1','f2','f3'], type: 'fork', delay: 1.0 },
      { from: 'indg', to: ['i1','i2'], type: 'fork', delay: 1.03 },
      { from: 'reg', to: ['r1','r2','r3'], type: 'fork', delay: 0.82 },
    ];

    function ocx(el) { return el.offsetLeft + el.offsetWidth / 2; }
    function ocy(el) { return el.offsetTop + el.offsetHeight / 2; }
    function obot(el) { return el.offsetTop + el.offsetHeight; }
    function otop(el) { return el.offsetTop; }
    function ort(el) { return el.offsetLeft + el.offsetWidth; }
    function olt(el) { return el.offsetLeft; }

    function addOrgPath(d, delay) {
      var p = document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d', d);
      p.classList.add('org-ln');
      orgSvg.appendChild(p);
      var l = p.getTotalLength();
      p.style.setProperty('--l', l);
      p.style.setProperty('--d', delay + 's');
    }

    function drawOrgLines() {
      orgSvg.innerHTML = '';
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          connections.forEach(function(conn) {
            var pEl = document.getElementById(conn.from);
            if (!pEl) return;
            var d0 = conn.delay;

            if (conn.type === 'straight') {
              var cEl = document.getElementById(conn.to[0]);
              addOrgPath('M'+ocx(pEl)+','+obot(pEl)+' L'+ocx(cEl)+','+otop(cEl), d0);
              return;
            }
            if (conn.type === 'side') {
              var cEl = document.getElementById(conn.to[0]);
              var sx = ort(pEl), sy = ocy(pEl);
              var ex = olt(cEl), ey = ocy(cEl);
              var mx = sx + (ex - sx) * 0.4;
              addOrgPath('M'+sx+','+sy+' L'+mx+','+sy+' L'+mx+','+ey+' L'+ex+','+ey, d0);
              return;
            }
            // fork: 하나의 연결 path로 그리기
            var kids = conn.to.map(function(id) { return document.getElementById(id); }).filter(Boolean);
            if (kids.length === 0) return;
            var pBotY = obot(pEl);
            var cTopY = Math.min.apply(null, kids.map(otop));
            var forkY = pBotY + (cTopY - pBotY) * 0.5;
            var xs = kids.map(ocx).sort(function(a,b){ return a-b; });

            // 전체를 하나의 path로: 수직 → 좌측으로 이동 → 좌에서 우로 수평 (각 child 위치에서 드롭)
            var d = 'M'+ocx(pEl)+','+pBotY+' L'+ocx(pEl)+','+forkY;
            d += ' L'+xs[0]+','+forkY;
            for (var i = 0; i < xs.length; i++) {
              d += ' L'+xs[i]+','+forkY;
              d += ' L'+xs[i]+','+otop(kids[i]);
              if (i < xs.length - 1) {
                d += ' M'+xs[i]+','+forkY;
              }
            }
            addOrgPath(d, d0);
          });
        });
      });
    }

    drawOrgLines();
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
