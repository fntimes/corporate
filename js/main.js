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

  // 조직도
  var orgChart = document.getElementById('orgChart');
  var orgSvg = document.getElementById('orgSvg');
  if (orgChart && orgSvg) {
    var orgNodes = [
      { id: 'ceo',      label: '대표이사 사장',   cls: 'c-navy lg',     x: 350, y: 20 },
      { id: 'evp',      label: '전무',            cls: 'c-navy',        x: 400, y: 90 },
      { id: 'ailab',    label: 'AI금융\n연구소',   cls: 'c-gold sm',     x: 580, y: 82 },
      { id: 'mgmt',     label: '경영\n지원실',     cls: 'c-brown sm',    x: 10,  y: 225 },
      { id: 'mkt',      label: '마케팅\n사업국',   cls: 'c-brown sm',    x: 85,  y: 225 },
      { id: 'edit',     label: '편집국',           cls: 'c-navy',        x: 240, y: 170 },
      { id: 'aimedia',  label: 'AI미디어\n본부',   cls: 'c-purple sm',   x: 480, y: 162 },
      { id: 'regional', label: '지역\n본부',       cls: 'c-teal sm',     x: 770, y: 162 },
      { id: 'fin',      label: '금융\n총괄국',     cls: 'c-navy-m sm',   x: 200, y: 310 },
      { id: 'ind',      label: '산업\n총괄국',     cls: 'c-navy-m sm',   x: 310, y: 310 },
      { id: 'am_edit',  label: '편집부',           cls: 'c-purple-l sm', x: 455, y: 260 },
      { id: 'am_biz',   label: '사업부',           cls: 'c-purple-l sm', x: 525, y: 260 },
      { id: 'wm',       label: 'WM국',            cls: 'c-purple-l sm', x: 610, y: 260 },
      { id: 'reg1',     label: '인천·강원\n·충청', cls: 'c-teal-l sm',   x: 700, y: 252 },
      { id: 'reg2',     label: '대구·경남\n·북',   cls: 'c-teal-l sm',   x: 800, y: 252 },
      { id: 'reg3',     label: '광주·전남\n·북',   cls: 'c-teal-l sm',   x: 895, y: 252 },
      { id: 'fin1',     label: '금융부',           cls: 'c-navy-l sm',   x: 140, y: 410 },
      { id: 'fin2',     label: '증권부',           cls: 'c-navy-l sm',   x: 210, y: 410 },
      { id: 'fin3',     label: '건설·\n부동산부',  cls: 'c-navy-l sm',   x: 275, y: 402 },
      { id: 'ind1',     label: '산업부',           cls: 'c-navy-l sm',   x: 365, y: 410 },
      { id: 'ind2',     label: '생활·\n경제부',    cls: 'c-navy-l sm',   x: 430, y: 402 },
      { id: 'wm1',      label: '편집부',           cls: 'c-purple-l sm', x: 590, y: 350 },
      { id: 'wm2',      label: '사업부',           cls: 'c-purple-l sm', x: 660, y: 350 },
    ];

    var orgEdges = [
      ['ceo', 'evp'],
      ['evp', 'ailab', 'h'],
      ['evp', 'mgmt'],
      ['evp', 'mkt'],
      ['evp', 'edit'],
      ['evp', 'aimedia'],
      ['evp', 'regional'],
      ['edit', 'fin'],
      ['edit', 'ind'],
      ['aimedia', 'am_edit'],
      ['aimedia', 'am_biz'],
      ['aimedia', 'wm'],
      ['fin', 'fin1'],
      ['fin', 'fin2'],
      ['fin', 'fin3'],
      ['ind', 'ind1'],
      ['ind', 'ind2'],
      ['wm', 'wm1'],
      ['wm', 'wm2'],
      ['regional', 'reg1'],
      ['regional', 'reg2'],
      ['regional', 'reg3'],
    ];

    var depthMap = {
      ceo:0, evp:1, ailab:1,
      mgmt:2, mkt:2, edit:2, aimedia:2, regional:2,
      fin:3, ind:3, am_edit:3, am_biz:3, wm:3, reg1:3, reg2:3, reg3:3,
      fin1:4, fin2:4, fin3:4, ind1:4, ind2:4, wm1:4, wm2:4
    };

    var nodeEls = {};
    var nodeMap = {};
    orgNodes.forEach(function (n) { nodeMap[n.id] = n; });

    function getBottom(n) {
      var el = nodeEls[n.id]; return { x: n.x + el.offsetWidth / 2, y: n.y + el.offsetHeight };
    }
    function getTop(n) {
      var el = nodeEls[n.id]; return { x: n.x + el.offsetWidth / 2, y: n.y };
    }
    function getRight(n) {
      var el = nodeEls[n.id]; return { x: n.x + el.offsetWidth, y: n.y + el.offsetHeight / 2 };
    }
    function getLeft(n) {
      var el = nodeEls[n.id]; return { x: n.x, y: n.y + el.offsetHeight / 2 };
    }

    function drawPath(d, delay) {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.classList.add('connector-line');
      orgSvg.appendChild(path);
      var len = path.getTotalLength();
      path.style.setProperty('--len', len);
      path.style.setProperty('--delay', delay + 's');
    }

    // Create nodes
    orgNodes.forEach(function (n) {
      var el = document.createElement('div');
      el.className = 'org-node ' + n.cls;
      el.innerHTML = n.label.replace(/\n/g, '<br>');
      el.style.left = n.x + 'px';
      el.style.top = n.y + 'px';
      var delay = (depthMap[n.id] || 0) * 0.35 + 0.1;
      el.style.setProperty('--delay', delay + 's');
      orgChart.appendChild(el);
      nodeEls[n.id] = el;
    });

    // Draw lines after layout
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        orgEdges.forEach(function (edge) {
          var pid = edge[0], cid = edge[1], type = edge[2];
          var parent = nodeMap[pid], child = nodeMap[cid];
          var baseDelay = (depthMap[pid] || 0) * 0.35 + 0.15;
          if (type === 'h') {
            var p = getRight(parent), c = getLeft(child);
            drawPath('M' + p.x + ',' + p.y + ' L' + c.x + ',' + c.y, baseDelay);
          } else {
            var p = getBottom(parent), c = getTop(child);
            if (Math.abs(p.x - c.x) < 2) {
              drawPath('M' + p.x + ',' + p.y + ' L' + c.x + ',' + c.y, baseDelay);
            } else {
              var midY = p.y + (c.y - p.y) * 0.5;
              drawPath('M' + p.x + ',' + p.y + ' L' + p.x + ',' + midY + ' L' + c.x + ',' + midY + ' L' + c.x + ',' + c.y, baseDelay);
            }
          }
        });
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
