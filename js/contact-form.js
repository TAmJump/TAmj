/*!
 * 115en グループ共通お問い合わせフォーム
 * 使い方：
 *   <div class="tj-contact" data-project="npo"></div>
 *   <script src="https://115en.com/js/contact-form.js" defer></script>
 * data-project … tamjump / scsgo / npo / gms（どの会社のサイトから来たかを表す）
 * 種別の一覧はここだけで管理する（全サイト共通）
 */
(function () {
  var API = 'https://tamjump-contact-api.animalb001.workers.dev/contact';
  var MAIL = 'info@115en.com';
  var CATS = [
    'DX事業（サイト・アプリ開発）について',
    '医療事業について',
    '介護事業について',
    'NPO活動・寄付・ボランティアについて',
    '健康増進事業について',
    '業務提携・出資について',
    '取材・メディアについて',
    '採用について',
    'その他'
  ];

  var CSS = '' +
    '.tjcf{--tjcf-fg:#111;--tjcf-line:#bdbdbd;--tjcf-accent:#111;color:var(--tjcf-fg);font:inherit;text-align:left;max-width:640px}' +
    '.tjcf *{box-sizing:border-box}' +
    '.tjcf label{display:block;font-size:13.5px;font-weight:700;margin:0 0 6px;color:var(--tjcf-fg)}' +
    '.tjcf label i{font-style:normal;color:#d0021b;margin-left:2px}' +
    '.tjcf label small{font-weight:400;color:#666;margin-left:4px}' +
    '.tjcf input,.tjcf select,.tjcf textarea{display:block;width:100%;font:inherit;font-size:15px;line-height:1.5;padding:10px 12px;border:1px solid var(--tjcf-line);background:#fff;color:var(--tjcf-fg);border-radius:0;margin:0 0 18px;-webkit-appearance:none;appearance:none}' +
    '.tjcf select{background-image:linear-gradient(45deg,transparent 50%,#111 50%),linear-gradient(135deg,#111 50%,transparent 50%);background-position:calc(100% - 18px) 50%,calc(100% - 13px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:36px}' +
    '.tjcf textarea{min-height:150px;resize:vertical}' +
    '.tjcf input:focus,.tjcf select:focus,.tjcf textarea:focus{outline:2px solid var(--tjcf-accent);outline-offset:0;border-color:var(--tjcf-fg)}' +
    '.tjcf .tjcf-btn{display:inline-block;font:inherit;font-size:15px;font-weight:700;letter-spacing:.08em;padding:12px 28px;margin:0 8px 8px 0;border:1px solid var(--tjcf-fg);background:var(--tjcf-fg);color:#fff;cursor:pointer;border-radius:0;width:auto}' +
    '.tjcf .tjcf-btn.line{background:#fff;color:var(--tjcf-fg)}' +
    '.tjcf .tjcf-btn:disabled{opacity:.5;cursor:default}' +
    '.tjcf .tjcf-confirm{display:none;border:1px solid var(--tjcf-fg);padding:20px;margin-bottom:18px;background:#fff}' +
    '.tjcf dl{margin:0 0 16px}' +
    '.tjcf dt{font-size:12.5px;color:#666}' +
    '.tjcf dd{margin:0 0 10px;white-space:pre-wrap;word-break:break-all}' +
    '.tjcf .tjcf-note{font-size:13.5px;margin:12px 0 0}' +
    '.tjcf .tjcf-note.err{color:#b00020}' +
    '.tjcf .tjcf-done{border-top:3px solid var(--tjcf-accent);padding-top:16px}' +
    '.tjcf .tjcf-done strong{font-size:20px}' +
    '.tjcf .tjcf-no{font-weight:700;font-size:20px;letter-spacing:.08em;margin:8px 0}' +
    '.tjcf .tjcf-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function mount(box, n) {
    var project = box.getAttribute('data-project') || 'tamjump';
    var preset = box.getAttribute('data-category') || '';
    if (box.getAttribute('data-accent')) box.style.setProperty('--tjcf-accent', box.getAttribute('data-accent'));
    var id = function (k) { return 'tjcf' + n + '-' + k; };
    var opts = '<option value="">選択してください</option>' + CATS.map(function (c) {
      return '<option' + (c === preset ? ' selected' : '') + '>' + esc(c) + '</option>';
    }).join('');

    box.classList.add('tjcf');
    box.innerHTML =
      '<form novalidate>' +
      '<div class="tjcf-fields">' +
      '<label for="' + id('name') + '">お名前<i>*</i></label><input id="' + id('name') + '" name="name" autocomplete="name" required>' +
      '<label for="' + id('email') + '">メールアドレス<i>*</i></label><input id="' + id('email') + '" name="email" type="email" autocomplete="email" required>' +
      '<label for="' + id('phone') + '">電話番号<small>（任意）</small></label><input id="' + id('phone') + '" name="phone" type="tel" autocomplete="tel">' +
      '<label for="' + id('cat') + '">お問い合わせ種別<i>*</i></label><select id="' + id('cat') + '" name="category" required>' + opts + '</select>' +
      '<label for="' + id('msg') + '">お問い合わせ内容<i>*</i></label><textarea id="' + id('msg') + '" name="message" required></textarea>' +
      '<div class="tjcf-hp" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div>' +
      '<button class="tjcf-btn" type="submit">入力内容を確認する</button>' +
      '</div>' +
      '<div class="tjcf-confirm" aria-live="polite"><dl>' +
      '<dt>お名前</dt><dd data-c="name"></dd><dt>メールアドレス</dt><dd data-c="email"></dd>' +
      '<dt>電話番号</dt><dd data-c="phone"></dd><dt>お問い合わせ種別</dt><dd data-c="category"></dd>' +
      '<dt>お問い合わせ内容</dt><dd data-c="message"></dd></dl>' +
      '<button class="tjcf-btn line" type="button" data-act="back">修正する</button>' +
      '<button class="tjcf-btn" type="button" data-act="send">送信する</button></div>' +
      '<p class="tjcf-note" role="status"></p>' +
      '</form>';

    var f = box.querySelector('form'), fields = box.querySelector('.tjcf-fields'),
      cf = box.querySelector('.tjcf-confirm'), note = box.querySelector('.tjcf-note'),
      send = box.querySelector('[data-act=send]');
    function v(k) { return f.elements[k].value.trim(); }
    function err(msg, k) { note.textContent = msg; note.className = 'tjcf-note err'; if (k) f.elements[k].focus(); }

    f.addEventListener('submit', function (e) {
      e.preventDefault(); note.textContent = ''; note.className = 'tjcf-note';
      var miss = ['name', 'email', 'category', 'message'].filter(function (k) { return !v(k); });
      if (miss.length) return err('未入力の項目があります。', miss[0]);
      if (!f.elements.email.checkValidity()) return err('メールアドレスの形式をご確認ください。', 'email');
      ['name', 'email', 'phone', 'category', 'message'].forEach(function (k) {
        cf.querySelector('[data-c=' + k + ']').textContent = v(k) || (k === 'phone' ? '未入力' : '');
      });
      fields.style.display = 'none'; cf.style.display = 'block'; send.focus();
    });
    box.querySelector('[data-act=back]').addEventListener('click', function () {
      cf.style.display = 'none'; fields.style.display = 'block'; f.elements.name.focus();
    });
    send.addEventListener('click', function () {
      if (v('website')) return; // ボット対策
      send.disabled = true; send.textContent = '送信中…';
      fetch(API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: project, name: v('name'), email: v('email'), phone: v('phone'), category: v('category'), message: v('message') })
      })
        .then(function (r) { return r.json().then(function (d) { if (!r.ok || !d.success) throw new Error(d.error || ''); return d; }); })
        .then(function (d) {
          f.innerHTML = '<div class="tjcf-done"><strong>ありがとうございます。</strong>' +
            '<p>お問い合わせを受け付けました。確認メールをお送りしましたのでご確認ください。</p>' +
            (d.ticketNumber ? '<div class="tjcf-no">' + esc(d.ticketNumber) + '</div><p class="tjcf-note">受付番号です。お問い合わせの際にお伝えください。</p>' : '') +
            '</div>';
        })
        .catch(function (e) {
          send.disabled = false; send.textContent = '送信する';
          err((e && e.message ? e.message + ' ' : '') + '送信に失敗しました。時間をおいて再度お試しいただくか、' + MAIL + ' までご連絡ください。');
        });
    });
  }

  function init() {
    if (!document.getElementById('tjcf-style')) {
      var s = document.createElement('style'); s.id = 'tjcf-style'; s.textContent = CSS; document.head.appendChild(s);
    }
    var boxes = document.querySelectorAll('.tj-contact');
    for (var i = 0; i < boxes.length; i++) if (!boxes[i].classList.contains('tjcf')) mount(boxes[i], i);
  }
  window.TJContactCategories = CATS;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
