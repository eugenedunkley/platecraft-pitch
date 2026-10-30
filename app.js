import { html, render, Component } from '/vendor/preact-htm.js';
import { Plate } from '/plate.js';

class App extends Component {
  componentDidMount() {
    this._onScroll = () => {
      const on = (window.scrollY || document.documentElement.scrollTop || 0) > 600;
      if (on !== !!(this.state && this.state.scrolled)) this.setState({ scrolled: on });
    };
    try { window.addEventListener('scroll', this._onScroll, { passive: true }); this._onScroll(); } catch (e) {}
  }
  componentWillUnmount() {
    try { window.removeEventListener('scroll', this._onScroll); } catch (e) {}
    if (this._ro) { try { this._ro.disconnect(); } catch (e) {} }
  }
  _watchCar(el) {
    if (!el || el === this._carEl) return;
    this._carEl = el;
    if (this._ro) { try { this._ro.disconnect(); } catch (e) {} }
    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width || 0);
      const cur = (this.state && this.state.carW) || 0;
      if (w > 0 && Math.abs(w - cur) > 1) this.setState({ carW: w });
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(measure);
      this._ro.observe(el);
    }
  }
  renderVals() {
    const s = this.state || {};
    const accent = this.props.accent ?? '#7CC4FF';
    const reg = s.reg ?? 'AB12 CDE';
    const shown = reg.trim() ? reg.trim() : 'YOUR REG';
    const finish = s.finish ?? '4d3';
    const need = s.need ?? 'pair';
    const light = s.light ?? 'studio';
    const border = s.border ?? 'none';
    const badge = s.badge ?? 'uk';
    const view = s.view ?? 'plates';
    const ptype = s.ptype ?? 'legal';
    const showFont = s.showFont ?? 'italic';
    const font = ptype === 'show' ? showFont : 'legal';
    const make = s.make ?? 'Volkswagen';
    const model = s.model ?? 'Golf';
    const year = s.year ?? '2021';
    const COLOURS = [
      { id: 'white', name: 'Pure White', hex: '#F4F4F1' },
      { id: 'black', name: 'Deep Black', hex: '#141518' },
      { id: 'silver', name: 'Moonstone Silver', hex: '#B7BCC3' },
      { id: 'grey', name: 'Graphite Grey', hex: '#5E636B' },
      { id: 'blue', name: 'Lapiz Blue', hex: '#1F3F8F' },
      { id: 'red', name: 'Tornado Red', hex: '#B3121B' },
      { id: 'green', name: 'British Racing Green', hex: '#1B4A36' },
      { id: 'orange', name: 'Lava Orange', hex: '#D2561B' },
      { id: 'yellow', name: 'Speed Yellow', hex: '#E5B70E' }
    ];
    const colourId = s.colour ?? 'blue';
    const preset = COLOURS.find((c) => c.id === colourId);
    const carHex = preset ? preset.hex : (s.customHex || '#1F3F8F');
    const colourName = preset ? preset.name : 'Custom colour';
    const BODY_WORDS = {
      suv: ['range rover', 'evoque', 'velar', 'defender', 'discovery', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'q2', 'q3', 'q5', 'q7', 'q8', 'qashqai', 'juke', 'x-trail', 'kuga', 'puma', 'tucson', 'kona', 'sportage', 'sorento', 'tiguan', 't-roc', 't-cross', 'touareg', 'karoq', 'kodiaq', 'rav4', 'c-hr', 'land cruiser', 'cayenne', 'macan', 'xc40', 'xc60', 'xc90', 'gla', 'glc', 'gle', 'model y', 'countryman', 'mokka', 'ateca', 'arona', '3008', '2008', '5008', 'captur', 'cx-5', 'cx-30', 'e-pace', 'f-pace', 'i-pace', 'ix', 'enyaq', 'niro', 'ioniq 5', 'id.4', 'bentayga', 'urus', 'suv', '4x4'],
      coupe: ['911', 'boxster', 'cayman', 'tt', 'r8', 'm2', 'm4', 'm8', 'z4', 'mx-5', 'gt86', 'gr86', 'supra', 'mustang', 'corvette', 'f-type', 'amg gt', 'sl', 'slk', 'huracan', 'aventador', 'ferrari', 'mclaren', '458', '488', 'vantage', 'db11', 'continental gt', 'rc', 'lc', 'coupe', 'scirocco', 'gt-r', '370z', 'emira', 'elise'],
      saloon: ['3 series', '5 series', '7 series', '3-series', '5-series', '7-series', 'a4', 'a6', 'a8', 'c-class', 'e-class', 's-class', 'c class', 'e class', 'passat', 'octavia', 'superb', 'model 3', 'model s', 'xe', 'xf', 'xj', 'mondeo', 'insignia', 'camry', 'accord', 'is', 'es', 'ls', 's60', 's90', 'giulia', 'panamera', 'taycan', 'arteon', 'cla', 'i4', 'saloon', 'sedan', 'quattroporte', 'ghibli', 'phantom', 'ghost']
    };
    const hay = (' ' + make + ' ' + model + ' ').toLowerCase();
    const hit = (words) => words.some((w) => new RegExp('(^|\\s)' + w.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + '(\\s|$)').test(hay));
    let autoBody = 'hatch';
    if (hit(BODY_WORDS.suv)) autoBody = 'suv';
    else if (hit(BODY_WORDS.coupe)) autoBody = 'coupe';
    else if (hit(BODY_WORDS.saloon)) autoBody = 'saloon';
    const body = s.body ?? autoBody;
    const BODY_LABEL = { hatch: 'Hatchback', saloon: 'Saloon', suv: 'SUV', coupe: 'Coupé' };
    const carW = s.carW || 820;
    const tidy = (v, n) => String(v || '').replace(/[^\w\s\-.'&]/g, '').slice(0, n);
    const set = (k, v) => () => this.setState({ [k]: v });
    const seg = (list, key, cur) => list.map((o) => ({
      ...o,
      pick: set(key, o.id),
      pressed: String(o.id === cur),
      ring: o.id === cur ? accent : 'transparent',
      bg: o.id === cur ? '#1B2533' : 'transparent',
      ink: o.id === cur ? '#FFFFFF' : '#B4BAC6'
    }));
    const FIN = [
      { id: 'standard', name: 'Printed', pair: 24.99, single: 14.99, blurb: 'Classic flat print. Crisp, clean, timeless.' },
      { id: 'gel', name: '3D Gel', pair: 34.99, single: 20.99, blurb: 'Domed resin letters with a glass-like gloss.' },
      { id: '4d3', name: '4D 3mm', pair: 44.99, single: 26.99, blurb: 'Laser-cut acrylic letters, raised 3mm.' },
      { id: '4d5', name: '4D 5mm', pair: 49.99, single: 29.99, blurb: 'Deeper cut, bolder shadow, maximum presence.' },
      { id: '5d', name: '5D Gel', pair: 59.99, single: 35.99, blurb: '5mm 4D acrylic topped with a gel dome.' }
    ];
    const finishes = FIN.map((f) => {
      const on = f.id === finish;
      return {
        ...f,
        reg: shown,
        border: border,
        badge: badge,
        font: font,
        price: '£' + (need === 'pair' ? f.pair : f.single).toFixed(2),
        pick: set('finish', f.id),
        view: () => {
          this.setState({ finish: f.id, view: 'plates' });
          try { const el = document.getElementById('builder'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
        },
        pressed: String(on),
        ring: on ? accent : '#23262F',
        bg: on ? '#16202E' : '#12141A',
        pill: on ? accent : 'rgba(18,20,26,.7)',
        ink: on ? '#0A0B0F' : '#EDEFF3',
        state: on ? 'In the studio ↑' : 'View in studio ↑',
        stateInk: on ? accent : '#9AA1AE'
      };
    });
    const cur = FIN.find((f) => f.id === finish) || FIN[2];
    const LIGHT = {
      studio: { bg: 'radial-gradient(ellipse 70% 60% at 50% 35%, #2B313D 0%, #11141A 72%)', ink: '#C9CED8', filter: 'none' },
      day: { bg: 'linear-gradient(180deg, #E3E9F0 0%, #B7C1CD 100%)', ink: '#1A1D24', filter: 'none' },
      night: { bg: 'radial-gradient(ellipse 80% 55% at 50% 100%, rgba(255,59,48,.32) 0%, rgba(255,59,48,0) 60%), radial-gradient(ellipse at 50% 30%, #141821 0%, #030405 75%)', ink: '#C9CED8', filter: 'brightness(.84) contrast(1.06)' }
    };
    const L = LIGHT[light] || LIGHT.studio;
    const NEED = { pair: 'Pair', front: 'Front only', rear: 'Rear only' };
    const SHOW_FEE = 5;
    const baseP = need === 'pair' ? cur.pair : cur.single;
    const totalP = baseP + ((s.ptype ?? 'legal') === 'show' ? SHOW_FEE : 0);
    const FONT_LIST = [
      { id: 'italic', label: 'Sport Italic', fam: "'Barlow Condensed', sans-serif", fw: 700, fst: 'italic' },
      { id: 'block', label: 'Block', fam: 'Anton, Impact, sans-serif', fw: 400, fst: 'normal' },
      { id: 'script', label: 'Script', fam: "'Kaushan Script', cursive", fw: 400, fst: 'normal' }
    ];
    const isShow = ptype === 'show';
    const views = seg([{ id: 'plates', label: 'Plates' }, { id: 'car', label: 'On my car' }], 'view', view)
      .map((v) => ({ ...v, dot: v.id === view ? '#FF3B30' : '#3A3F4B' }));
    const yearTxt = tidy(year, 4);
    return {
      accent,
      reg,
      shown,
      finish,
      border,
      badge,
      font,
      views,
      total: '£' + totalP.toFixed(2),
      totalNote: (need === 'pair' ? 'Pair' : 'Single plate') + ' · ' + cur.name + ((s.ptype ?? 'legal') === 'show' ? ' · show font +£' + SHOW_FEE.toFixed(2) : '') + ' · free tracked delivery',
      topStyle: s.scrolled ? 'opacity: 1; transform: none; pointer-events: auto' : 'opacity: 0; transform: translateY(12px); pointer-events: none',
      showPlates: view === 'plates',
      showCar: view === 'car',
      types: seg([{ id: 'legal', label: 'Road legal' }, { id: 'show', label: 'Show plate' }], 'ptype', ptype),
      isShow,
      fonts: FONT_LIST.map((f) => ({ ...f, pick: set('showFont', f.id), pressed: String(f.id === showFont), ring: f.id === showFont ? accent : '#23262F', bg: f.id === showFont ? '#16202E' : '#0A0B0F' })),
      legalNote: isShow
        ? 'Show plates are not road legal. For car shows, off-road display and private land only.'
        : 'Charles Wright 2001 is the only road-legal font in the UK, so every road plate uses it. Want a different look? Choose Show plate.',
      legalShort: isShow ? 'Show plate · not road legal' : 'Road legal · BS AU 145e',
      legalInk: isShow ? '#FFB86B' : '#8FD3A8',
      legalFoot: isShow ? 'Show plate · Not for road use · Made to order in the UK' : 'Road-legal to BS AU 145e · Made to order in the UK',
      make,
      model,
      year,
      onMake: (e) => this.setState({ make: tidy(e.target.value, 24), body: undefined }),
      onModel: (e) => this.setState({ model: tidy(e.target.value, 28), body: undefined }),
      onYear: (e) => this.setState({ year: String(e.target.value || '').replace(/\D/g, '').slice(0, 4) }),
      onCustom: (e) => this.setState({ colour: 'custom', customHex: String(e.target.value || '#1F3F8F') }),
      colours: COLOURS.map((c) => ({ ...c, pick: set('colour', c.id), pressed: String(c.id === colourId), ring: c.id === colourId ? accent : 'rgba(0,0,0,0)' })),
      colourName,
      carHex,
      bodies: seg([{ id: 'hatch', label: 'Hatch' }, { id: 'saloon', label: 'Saloon' }, { id: 'suv', label: 'SUV' }, { id: 'coupe', label: 'Coupé' }], 'body', body),
      bodyHint: s.body ? BODY_LABEL[body] : 'AUTO: ' + BODY_LABEL[autoBody].toUpperCase(),
      isHatch: body === 'hatch',
      isSaloon: body === 'saloon',
      isSuv: body === 'suv',
      isCoupe: body === 'coupe',
      carRef: (el) => this._watchCar(el),
      pwHatch: Math.round(carW * 0.1868),
      pwSaloon: Math.round(carW * 0.1808),
      pwSuv: Math.round(carW * 0.1719),
      pwCoupe: Math.round(carW * 0.1987),
      carTitle: [yearTxt, make, model].filter((x) => String(x || '').trim()).join(' ') || 'Your car',
      carSub: colourName + ' · ' + cur.name + ' rear plate',
      carLabel: 'Preview of a ' + colourName + ' ' + BODY_LABEL[body] + ' with rear plate ' + shown + ' in ' + cur.name + ' finish',
      videoRef: (el) => { if (el) { try { el.muted = true; const p = el.play && el.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {} } },
      onReg: (e) => this.setState({ reg: String(e.target.value || '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ').slice(0, 8) }),
      finishes,
      finishName: cur.name,
      finishBlurb: cur.blurb,
      lights: seg([{ id: 'studio', label: 'Studio' }, { id: 'day', label: 'Daylight' }, { id: 'night', label: 'Night' }], 'light', light),
      needs: seg([{ id: 'pair', label: 'Pair' }, { id: 'front', label: 'Front only' }, { id: 'rear', label: 'Rear only' }], 'need', need),
      borders: seg([{ id: 'none', label: 'None' }, { id: 'black', label: 'Black' }, { id: 'blue', label: 'Blue' }], 'border', border),
      badges: seg([{ id: 'uk', label: 'UK flag' }, { id: 'none', label: 'None' }], 'badge', badge),
      showFront: need !== 'rear',
      showRear: need !== 'front',
      stageW: need === 'pair' ? 460 : 560,
      stageBg: L.bg,
      stageInk: L.ink,
      plateFilter: L.filter,
      needLabel: NEED[need],
      borderLabel: border === 'none' ? 'No border' : (border === 'black' ? 'Black border' : 'Blue border'),
      badgeLabel: badge === 'uk' ? 'UK flag' : 'No badge'
    };
  }
  render() { const V = this.renderVals(); return html`<div style="background: #0A0B0F; color: #EDEFF3; font-family: Manrope, system-ui, sans-serif; min-height: 100vh; overflow-x: hidden">

  <section id="top" aria-label="Hero" style="position: relative; overflow: hidden; min-height: 100vh; background: #030405">
    <video class="hero-video" ref=${V.videoRef} autoplay muted loop playsinline preload="auto" poster="/assets/poster.jpg" aria-hidden="true" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 60% 50%">
      <source src="/assets/hero.mp4" type="video/mp4" />
    </video>
    <div aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(3,4,5,.94) 0%, rgba(3,4,5,.72) 32%, rgba(3,4,5,.15) 62%, rgba(3,4,5,0) 80%); z-index: 1"></div>
    <div aria-hidden="true" style="position: absolute; inset: 0; background: radial-gradient(ellipse 90% 80% at 60% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,.75) 100%); z-index: 1"></div>
    <div aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 260px; background: linear-gradient(0deg, #0A0B0F 0%, rgba(10,11,15,.6) 45%, rgba(10,11,15,0) 100%); z-index: 1"></div>
    <div aria-hidden="true" class="bar-top" style="position: absolute; top: 0; left: 0; right: 0; height: 42px; background: #000; z-index: 5"></div>
    <div aria-hidden="true" class="bar-bot" style="position: absolute; bottom: 0; left: 0; right: 0; height: 42px; background: #000; z-index: 5"></div>

    <div style="position: relative; z-index: 3; min-height: 100vh; box-sizing: border-box; padding: 42px 0; display: flex; flex-direction: column">
      <header style="width: 100%; max-width: 1360px; margin: 0 auto; box-sizing: border-box; padding: 26px 28px 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap">
        <a href="#top" style="color: #EDEFF3; text-decoration: none; font-family: Archivo, sans-serif; font-weight: 850; font-stretch: 72%; letter-spacing: .1em; font-size: 24px">PLATE<span style="color: ${V.accent}">CRAFT</span></a>
        <nav aria-label="Primary" style="display: flex; align-items: center; gap: 22px; flex-wrap: wrap">
          <a href="#builder" style="color: #C9CED8; text-decoration: none; font-size: 15px; font-weight: 600">Builder</a>
          <a href="#finishes" style="color: #C9CED8; text-decoration: none; font-size: 15px; font-weight: 600">Finishes</a>
          <a href="#builder" style="display: inline-flex; align-items: center; min-height: 44px; padding: 0 18px; border-radius: 999px; border: 1px solid rgba(237,239,243,.35); background: rgba(10,11,15,.35); color: #EDEFF3; text-decoration: none; font-size: 15px; font-weight: 700">Build now</a>
        </nav>
      </header>

      <div style="flex: 1 1 auto; width: 100%; max-width: 1360px; margin: 0 auto; box-sizing: border-box; padding: 40px 28px 56px; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 48px">
        <div class="rise" style="flex: 1 1 420px; min-width: 0; max-width: 600px; display: flex; flex-direction: column; gap: 24px">
          <span style="display: inline-flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 700; letter-spacing: .3em; color: #C9CED8"><span aria-hidden="true" style="width: 34px; height: 1px; background: ${V.accent}"></span>SCENE 01 · AFTER DARK</span>
          <h1 class="hero-h1" style="margin: 0; font-family: Archivo, sans-serif; font-weight: 900; font-stretch: 66%; font-size: 104px; line-height: .88; letter-spacing: -.01em; text-transform: uppercase; text-shadow: 0 6px 40px rgba(0,0,0,.6)">Your reg.<br />Your finish.<br /><span style="color: ${V.accent}">Seen first.</span></h1>
          <p style="margin: 0; max-width: 460px; font-size: 18px; line-height: 1.6; color: #C9CED8">Type it once and watch your plate render live in Printed, 3D Gel, 4D or 5D. Know exactly what lands on your car before you pay.</p>
          <div style="display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px">
            <div style="display: flex; flex-direction: column; gap: 8px">
              <label for="hero-reg" style="font-size: 13px; font-weight: 600; color: #C9CED8">Enter your registration</label>
              <input id="hero-reg" type="text" value=${V.reg} onInput=${V.onReg} style="width: 236px; height: 62px; box-sizing: border-box; border-radius: 8px; border: 2px solid #121212; background: linear-gradient(160deg, #FFDA3D 0%, #F6C400 60%, #E2AE00 100%); color: #121212; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 40px; letter-spacing: .04em; text-align: center; text-transform: uppercase; padding: 0 10px; box-shadow: 0 10px 30px rgba(0,0,0,.5)" />
            </div>
            <a href="#builder" style="display: inline-flex; align-items: center; justify-content: center; height: 62px; padding: 0 28px; border-radius: 10px; background: ${V.accent}; color: #0A0B0F; font-weight: 800; font-size: 16px; text-decoration: none; box-shadow: 0 10px 30px rgba(0,0,0,.45)">Build my plates</a>
          </div>
          <span style="font-size: 13px; color: #9AA1AE">Pairs from £24.99 · Free tracked delivery · [RATING] from [N] reviews</span>
        </div>

        <div class="rise rise-2" style="flex: 0 1 520px; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 18px">
          <span style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 999px; background: rgba(10,11,15,.55); border: 1px solid rgba(237,239,243,.18); font-size: 12px; font-weight: 700; letter-spacing: .18em; color: #EDEFF3"><span aria-hidden="true" style="width: 8px; height: 8px; border-radius: 50%; background: #FF3B30; box-shadow: 0 0 10px rgba(255,59,48,.95)"></span>LIVE · ${V.finishName}</span>
          <div class="plate-float plate-zoom" style="display: flex; flex-direction: column; align-items: center">
            <${Plate} reg=${V.shown} finish=${V.finish} side="rear" border=${V.border} badge=${V.badge} font=${V.font} plateWidth="480" />
            <div aria-hidden="true" style="margin-top: 6px; transform: scaleY(-1); opacity: .22; filter: blur(1px); -webkit-mask-image: linear-gradient(0deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,0) 60%); mask-image: linear-gradient(0deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,0) 60%)">
              <${Plate} reg=${V.shown} finish=${V.finish} side="rear" border=${V.border} badge=${V.badge} font=${V.font} plateWidth="480" />
            </div>
          </div>
          <div role="group" aria-label="Preview a finish" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px">
            ${(V.finishes||[]).map((item, $index) => html`
              <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid ${item.ring}; background: ${item.pill}; color: ${item.ink}; font-family: Manrope, sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; backdrop-filter: blur(8px)">${item.name}</button>
            `)}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="builder" aria-labelledby="builder-h" style="max-width: 1280px; margin: 0 auto; padding: 96px 24px 56px">
    <div style="display: flex; flex-direction: column; gap: 14px; max-width: 720px; margin-bottom: 36px">
      <span style="font-size: 13px; font-weight: 700; letter-spacing: .22em; color: ${V.accent}">THE STUDIO</span>
      <h2 id="builder-h" class="sec-h2" style="margin: 0; font-family: Archivo, sans-serif; font-weight: 850; font-stretch: 72%; font-size: 52px; line-height: 1; text-transform: uppercase">Build it. See it. Exactly as it arrives.</h2>
      <p style="margin: 0; font-size: 17px; line-height: 1.6; color: #B4BAC6">Every choice re-renders your plates instantly. Change the light to check how the finish catches it.</p>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 28px; align-items: flex-start">
      <div style="flex: 999 1 620px; min-width: 0; display: flex; flex-direction: column; gap: 28px">
      <div style="border-radius: 22px; overflow: hidden; border: 1px solid #23262F; background: #12141A">
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #23262F">
          <div role="group" aria-label="Preview view" style="display: flex; flex-wrap: wrap; gap: 4px; padding: 4px; background: #0A0B0F; border: 1px solid #23262F; border-radius: 12px">
            ${(V.views||[]).map((item, $index) => html`
              <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 16px; border-radius: 9px; border: 1px solid ${item.ring}; background: ${item.bg}; color: ${item.ink}; font-family: Manrope, sans-serif; font-weight: 700; font-size: 14px; cursor: pointer"><span aria-hidden="true" style="width: 8px; height: 8px; border-radius: 50%; background: ${item.dot}"></span>${item.label}</button>
            `)}
          </div>
          ${V.showPlates ? html`
            <div role="group" aria-label="Lighting" style="display: flex; flex-wrap: wrap; gap: 4px; padding: 4px; background: #0A0B0F; border: 1px solid #23262F; border-radius: 12px">
              ${(V.lights||[]).map((item, $index) => html`
                <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="min-height: 44px; padding: 0 16px; border-radius: 9px; border: 1px solid ${item.ring}; background: ${item.bg}; color: ${item.ink}; font-family: Manrope, sans-serif; font-weight: 700; font-size: 14px; cursor: pointer">${item.label}</button>
              `)}
            </div>
          ` : null}
          ${V.showCar ? html`
            <span style="display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; letter-spacing: .14em; color: #C9CED8"><span aria-hidden="true" style="width: 8px; height: 8px; border-radius: 50%; background: #FF3B30; box-shadow: 0 0 10px rgba(255,59,48,.9)"></span>LIVE ON YOUR CAR</span>
          ` : null}
        </div>

        ${V.showCar ? html`
          <div style="display: flex; flex-direction: column">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; padding: 16px; border-bottom: 1px solid #23262F">
              <div style="display: flex; flex-direction: column; gap: 6px; min-width: 0">
                <label for="car-make" style="font-size: 12px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">MAKE</label>
                <input id="car-make" class="field" type="text" value=${V.make} onInput=${V.onMake} autocomplete="off" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px; min-width: 0">
                <label for="car-model" style="font-size: 12px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">MODEL</label>
                <input id="car-model" class="field" type="text" value=${V.model} onInput=${V.onModel} autocomplete="off" />
              </div>
              <div style="display: flex; flex-direction: column; gap: 6px; min-width: 0">
                <label for="car-year" style="font-size: 12px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">YEAR</label>
                <input id="car-year" class="field" type="text" inputmode="numeric" value=${V.year} onInput=${V.onYear} autocomplete="off" />
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 16px; border-bottom: 1px solid #23262F">
              <div style="display: flex; flex-direction: column; gap: 8px; min-width: 0">
                <span id="colour-label" style="font-size: 12px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">COLOUR · ${V.colourName}</span>
                <div role="group" aria-labelledby="colour-label" style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px">
                  ${(V.colours||[]).map((item, $index) => html`
                    <button type="button" class="swatch" onClick=${item.pick} aria-pressed=${item.pressed} aria-label=${item.name} style="background: ${item.hex}; border: 3px solid ${item.ring}; box-shadow: inset 0 0 0 1px rgba(255,255,255,.25)"></button>
                  `)}
                  <label for="car-custom" style="position: relative; display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 1px dashed #6B7280; cursor: pointer; overflow: hidden" title="Custom colour">
                    <span aria-hidden="true" style="font-size: 20px; line-height: 1; color: #C9CED8">+</span>
                    <input id="car-custom" type="color" value=${V.carHex} onInput=${V.onCustom} aria-label="Custom colour" style="position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%" />
                  </label>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px">
                <span id="body-label" style="font-size: 12px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">BODY · ${V.bodyHint}</span>
                <div role="group" aria-labelledby="body-label" style="display: flex; flex-wrap: wrap; gap: 4px; padding: 4px; background: #0A0B0F; border: 1px solid #23262F; border-radius: 12px">
                  ${(V.bodies||[]).map((item, $index) => html`
                    <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="min-height: 44px; padding: 0 12px; border-radius: 9px; border: 1px solid ${item.ring}; background: ${item.bg}; color: ${item.ink}; font-family: Manrope, sans-serif; font-weight: 700; font-size: 13px; cursor: pointer">${item.label}</button>
                  `)}
                </div>
              </div>
            </div>
            <div ref=${V.carRef} role="img" aria-label=${V.carLabel} style="position: relative; width: 100%; aspect-ratio: 1344 / 752; isolation: isolate; overflow: hidden; background: #050506">
              ${V.isHatch ? html`
                <div style="position: absolute; inset: 0">
                  <img class="car-img" src="/assets/hatch.jpg" alt="" />
                  <div class="tint tint-hatch" style="background-color: ${V.carHex}"></div>
                  <img class="car-hl" src="/assets/hatch-hl.png" alt="" />
                  <div class="car-plate" style="left: 49.516%; top: 61.303%"><${Plate} reg=${V.shown} finish=${V.finish} side="rear" border=${V.border} badge=${V.badge} font=${V.font} plateWidth=${V.pwHatch} /></div>
                </div>
              ` : null}
              ${V.isSaloon ? html`
                <div style="position: absolute; inset: 0">
                  <img class="car-img" src="/assets/saloon.jpg" alt="" />
                  <div class="tint tint-saloon" style="background-color: ${V.carHex}"></div>
                  <img class="car-hl" src="/assets/saloon-hl.png" alt="" />
                  <div class="car-plate" style="left: 49.888%; top: 42.952%"><${Plate} reg=${V.shown} finish=${V.finish} side="rear" border=${V.border} badge=${V.badge} font=${V.font} plateWidth=${V.pwSaloon} /></div>
                </div>
              ` : null}
              ${V.isSuv ? html`
                <div style="position: absolute; inset: 0">
                  <img class="car-img" src="/assets/suv.jpg" alt="" />
                  <div class="tint tint-suv" style="background-color: ${V.carHex}"></div>
                  <img class="car-hl" src="/assets/suv-hl.png" alt="" />
                  <div class="car-plate" style="left: 49.888%; top: 41.423%"><${Plate} reg=${V.shown} finish=${V.finish} side="rear" border=${V.border} badge=${V.badge} font=${V.font} plateWidth=${V.pwSuv} /></div>
                </div>
              ` : null}
              ${V.isCoupe ? html`
                <div style="position: absolute; inset: 0">
                  <img class="car-img" src="/assets/coupe.jpg" alt="" />
                  <div class="tint tint-coupe" style="background-color: ${V.carHex}"></div>
                  <img class="car-hl" src="/assets/coupe-hl.png" alt="" />
                  <div class="car-plate" style="left: 49.74%; top: 56.051%"><${Plate} reg=${V.shown} finish=${V.finish} side="rear" border=${V.border} badge=${V.badge} font=${V.font} plateWidth=${V.pwCoupe} /></div>
                </div>
              ` : null}
              <div aria-hidden="true" style="position: absolute; left: 16px; bottom: 14px; z-index: 3; display: flex; flex-direction: column; gap: 2px">
                <span style="font-family: Archivo, sans-serif; font-weight: 850; font-stretch: 72%; font-size: 26px; line-height: 1; text-transform: uppercase; color: #FFFFFF">${V.carTitle}</span>
                <span style="font-size: 13px; font-weight: 600; color: #C9CED8">${V.carSub}</span>
              </div>
            </div>
          </div>
        ` : null}

        ${V.showPlates ? html`
        <div style="min-height: 500px; padding: 48px 24px; box-sizing: border-box; background: ${V.stageBg}; display: flex; align-items: center; justify-content: center; transition: background .4s ease">
          <div class="stage-zoom" style="display: flex; flex-direction: column; align-items: center; gap: 30px; filter: ${V.plateFilter}">
            ${V.showFront ? html`
              <div style="display: flex; flex-direction: column; align-items: center; gap: 12px">
                <${Plate} reg=${V.shown} finish=${V.finish} side="front" border=${V.border} badge=${V.badge} font=${V.font} plateWidth=${V.stageW} />
                <span style="font-size: 12px; font-weight: 700; letter-spacing: .2em; color: ${V.stageInk}">FRONT · WHITE</span>
              </div>
            ` : null}
            ${V.showRear ? html`
              <div style="display: flex; flex-direction: column; align-items: center; gap: 12px">
                <${Plate} reg=${V.shown} finish=${V.finish} side="rear" border=${V.border} badge=${V.badge} font=${V.font} plateWidth=${V.stageW} />
                <span style="font-size: 12px; font-weight: 700; letter-spacing: .2em; color: ${V.stageInk}">REAR · YELLOW</span>
              </div>
            ` : null}
          </div>
        </div>
        ` : null}
        <div style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; padding: 16px 20px; border-top: 1px solid #23262F">
          <span style="font-family: Archivo, sans-serif; font-weight: 800; font-stretch: 80%; font-size: 20px">${V.finishName}</span>
          <span style="font-size: 15px; color: #9AA1AE">${V.finishBlurb}</span>
          <span style="margin-left: auto; font-size: 13px; font-weight: 700; color: ${V.legalInk}">${V.legalShort}</span>
        </div>
      </div>

      <figure style="margin: 0; position: relative; border-radius: 22px; overflow: hidden; border: 1px solid #23262F; background: #050506">
        <video ref=${V.videoRef} autoplay muted loop playsinline preload="metadata" poster="/assets/work-poster.jpg" aria-hidden="true" style="display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover">
          <source src="/assets/work.mp4" type="video/mp4" />
        </video>
        <div aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(0deg, rgba(5,5,6,.92) 0%, rgba(5,5,6,.35) 38%, rgba(5,5,6,0) 62%)"></div>
        <figcaption style="position: absolute; left: 0; right: 0; bottom: 0; padding: 22px 24px; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 14px">
          <span style="display: flex; flex-direction: column; gap: 8px; max-width: 460px">
            <span style="font-size: 12px; font-weight: 700; letter-spacing: .22em; color: ${V.accent}">MADE IN OUR WORKSHOP</span>
            <span style="font-family: Archivo, sans-serif; font-weight: 850; font-stretch: 72%; font-size: 30px; line-height: 1.02; text-transform: uppercase; color: #FFFFFF">Laser-cut. Hand-set. Checked twice.</span>
          </span>
          <span style="font-size: 14px; line-height: 1.5; color: #C9CED8; max-width: 300px">Every 4D character is cut from solid black acrylic and set by hand to the legal spacing grid.</span>
        </figcaption>
      </figure>
      </div>

      <div style="flex: 1 1 380px; min-width: 0; box-sizing: border-box; padding: 26px; border-radius: 22px; border: 1px solid #23262F; background: #12141A; display: flex; flex-direction: column; gap: 26px">
        <div style="display: flex; flex-direction: column; gap: 10px">
          <label for="builder-reg" style="font-size: 13px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">1 · REGISTRATION</label>
          <input id="builder-reg" type="text" value=${V.reg} onInput=${V.onReg} style="height: 60px; box-sizing: border-box; border-radius: 10px; border: 1px solid #3A3F4B; background: #0A0B0F; color: #EDEFF3; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 34px; letter-spacing: .06em; text-align: center; text-transform: uppercase; padding: 0 12px" />
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px">
          <span id="type-label" style="font-size: 13px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">2 · PLATE TYPE & FONT</span>
          <div role="group" aria-labelledby="type-label" style="display: flex; gap: 4px; padding: 4px; background: #0A0B0F; border: 1px solid #23262F; border-radius: 12px">
            ${(V.types||[]).map((item, $index) => html`
              <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="flex: 1 1 0; min-height: 44px; padding: 0 12px; border-radius: 9px; border: 1px solid ${item.ring}; background: ${item.bg}; color: ${item.ink}; font-family: Manrope, sans-serif; font-weight: 700; font-size: 14px; cursor: pointer">${item.label}</button>
            `)}
          </div>
          ${V.isShow ? html`
            <div role="group" aria-label="Show plate font" style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px">
              ${(V.fonts||[]).map((item, $index) => html`
                <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="display: flex; flex-direction: column; align-items: center; gap: 2px; min-height: 64px; padding: 8px 6px; border-radius: 10px; border: 2px solid ${item.ring}; background: ${item.bg}; color: #EDEFF3; cursor: pointer">
                  <span style="font-family: ${item.fam}; font-weight: ${item.fw}; font-style: ${item.fst}; font-size: 24px; line-height: 1.1">AB12</span>
                  <span style="font-family: Manrope, sans-serif; font-size: 12px; font-weight: 700; color: #9AA1AE">${item.label}</span>
                </button>
              `)}
            </div>
          ` : null}
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: ${V.legalInk}">${V.legalNote}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px">
          <span id="finish-label" style="font-size: 13px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">3 · FINISH</span>
          <div role="group" aria-labelledby="finish-label" style="display: flex; flex-direction: column; gap: 8px">
            ${(V.finishes||[]).map((item, $index) => html`
              <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="display: flex; flex-direction: column; align-items: stretch; gap: 4px; text-align: left; padding: 12px 14px; border-radius: 12px; border: 2px solid ${item.ring}; background: ${item.bg}; color: #EDEFF3; font-family: Manrope, sans-serif; cursor: pointer">
                <span style="display: flex; justify-content: space-between; align-items: center; gap: 8px"><span style="font-weight: 800; font-size: 16px">${item.name}</span><span style="font-size: 13px; font-weight: 700; color: #C9CED8">${item.price}</span></span>
                <span style="font-size: 13px; line-height: 1.45; color: #9AA1AE">${item.blurb}</span>
              </button>
            `)}
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px">
          <span id="need-label" style="font-size: 13px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">4 · PLATES NEEDED</span>
          <div role="group" aria-labelledby="need-label" style="display: flex; flex-wrap: wrap; gap: 4px; padding: 4px; background: #0A0B0F; border: 1px solid #23262F; border-radius: 12px">
            ${(V.needs||[]).map((item, $index) => html`
              <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="flex: 1 1 auto; min-height: 44px; padding: 0 14px; border-radius: 9px; border: 1px solid ${item.ring}; background: ${item.bg}; color: ${item.ink}; font-family: Manrope, sans-serif; font-weight: 700; font-size: 14px; cursor: pointer">${item.label}</button>
            `)}
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 18px">
          <div style="flex: 1 1 160px; display: flex; flex-direction: column; gap: 10px">
            <span id="border-label" style="font-size: 13px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">5 · BORDER</span>
            <div role="group" aria-labelledby="border-label" style="display: flex; gap: 4px; padding: 4px; background: #0A0B0F; border: 1px solid #23262F; border-radius: 12px">
              ${(V.borders||[]).map((item, $index) => html`
                <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="flex: 1 1 auto; min-height: 44px; padding: 0 10px; border-radius: 9px; border: 1px solid ${item.ring}; background: ${item.bg}; color: ${item.ink}; font-family: Manrope, sans-serif; font-weight: 700; font-size: 14px; cursor: pointer">${item.label}</button>
              `)}
            </div>
          </div>
          <div style="flex: 1 1 160px; display: flex; flex-direction: column; gap: 10px">
            <span id="badge-label" style="font-size: 13px; font-weight: 700; letter-spacing: .12em; color: #C9CED8">6 · SIDE BADGE</span>
            <div role="group" aria-labelledby="badge-label" style="display: flex; gap: 4px; padding: 4px; background: #0A0B0F; border: 1px solid #23262F; border-radius: 12px">
              ${(V.badges||[]).map((item, $index) => html`
                <button type="button" onClick=${item.pick} aria-pressed=${item.pressed} style="flex: 1 1 auto; min-height: 44px; padding: 0 10px; border-radius: 9px; border: 1px solid ${item.ring}; background: ${item.bg}; color: ${item.ink}; font-family: Manrope, sans-serif; font-weight: 700; font-size: 14px; cursor: pointer">${item.label}</button>
              `)}
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px solid #23262F">
          <div style="display: flex; justify-content: space-between; gap: 12px; font-size: 14px"><span style="color: #9AA1AE">Plates</span><span style="font-weight: 700">${V.needLabel} · ${V.finishName}</span></div>
          <div style="display: flex; justify-content: space-between; gap: 12px; font-size: 14px"><span style="color: #9AA1AE">Border / badge</span><span style="font-weight: 700">${V.borderLabel} · ${V.badgeLabel}</span></div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-top: 6px"><span style="font-size: 15px; color: #C9CED8">Total</span><span style="font-family: Archivo, sans-serif; font-weight: 850; font-stretch: 80%; font-size: 32px">${V.total}</span></div>
          <span style="font-size: 13px; color: #9AA1AE; text-align: right">${V.totalNote}</span>
          <button type="button" style="margin-top: 8px; height: 58px; border-radius: 12px; border: 0; background: ${V.accent}; color: #0A0B0F; font-family: Manrope, sans-serif; font-weight: 800; font-size: 17px; cursor: pointer">Add to basket</button>
          <span style="font-size: 13px; color: #9AA1AE; text-align: center">${V.legalFoot}</span>
        </div>
      </div>
    </div>
  </section>

  <section id="finishes" aria-labelledby="finishes-h" style="max-width: 1280px; margin: 0 auto; padding: 56px 24px 72px">
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 30px">
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 640px">
        <span style="font-size: 13px; font-weight: 700; letter-spacing: .22em; color: ${V.accent}">SIDE BY SIDE</span>
        <h2 id="finishes-h" class="sec-h2" style="margin: 0; font-family: Archivo, sans-serif; font-weight: 850; font-stretch: 72%; font-size: 52px; line-height: 1; text-transform: uppercase">Your reg. Every finish. One glance.</h2>
      </div>
      <p style="margin: 0; max-width: 380px; font-size: 16px; line-height: 1.6; color: #B4BAC6">No more imagining it from a sample photo. Tap any finish to send it to the studio.</p>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px">
      ${(V.finishes||[]).map((item, $index) => html`
        <button type="button" onClick=${item.view} aria-pressed=${item.pressed} style="display: flex; flex-direction: column; gap: 14px; text-align: left; padding: 16px; border-radius: 18px; border: 2px solid ${item.ring}; background: ${item.bg}; color: #EDEFF3; font-family: Manrope, sans-serif; cursor: pointer; min-width: 0">
          <span style="display: flex; align-items: center; justify-content: center; height: 124px; border-radius: 12px; background: radial-gradient(ellipse 70% 60% at 50% 35%, #2B313D 0%, #0E1015 78%)">
            <${Plate} reg=${item.reg} finish=${item.id} side="rear" border=${item.border} badge=${item.badge} font=${item.font} plateWidth="220" />
          </span>
          <span style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px"><span style="font-family: Archivo, sans-serif; font-weight: 800; font-stretch: 80%; font-size: 22px">${item.name}</span><span style="font-size: 13px; font-weight: 700; color: ${item.stateInk}">${item.state}</span></span>
          <span style="font-size: 14px; line-height: 1.5; color: #9AA1AE">${item.blurb}</span>
        </button>
      `)}
    </div>
  </section>

  <section aria-labelledby="why-h" style="max-width: 1280px; margin: 0 auto; padding: 40px 24px 96px">
    <h2 id="why-h" style="margin: 0 0 28px; font-size: 13px; font-weight: 700; letter-spacing: .22em; color: ${V.accent}">WHY IT SELLS MORE PLATES</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px">
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 26px; border-radius: 18px; border: 1px solid #23262F; background: #12141A">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke=${V.accent} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        <h3 style="margin: 0; font-family: Archivo, sans-serif; font-weight: 800; font-stretch: 80%; font-size: 24px">Live mock-up, every click</h3>
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #9AA1AE">The buyer sees their exact reg in their exact finish. No placeholder images, no guessing, no second thoughts at checkout.</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 26px; border-radius: 18px; border: 1px solid #23262F; background: #12141A">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke=${V.accent} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>
        <h3 style="margin: 0; font-family: Archivo, sans-serif; font-weight: 800; font-stretch: 80%; font-size: 24px">Checked in real light</h3>
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #9AA1AE">Studio, daylight and night views show how gel gloss and 4D depth actually read on the road.</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 26px; border-radius: 18px; border: 1px solid #23262F; background: #12141A">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke=${V.accent} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
        <h3 style="margin: 0; font-family: Archivo, sans-serif; font-weight: 800; font-stretch: 80%; font-size: 24px">One screen to basket</h3>
        <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #9AA1AE">Reg, type, finish, plates, border and badge in six numbered steps, plus a live view on their own car. Fewer clicks, fewer drop-offs, bigger baskets.</p>
      </div>
    </div>
  </section>

  <a href="#top" aria-label="Back to top" class="to-top" style=${V.topStyle}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0B0F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg></a>

  <footer style="border-top: 1px solid #1A1D24">
    <div style="max-width: 1280px; margin: 0 auto; padding: 28px 24px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; font-size: 13px; color: #9AA1AE">
      <span>PLATECRAFT · Concept for pitch, October 2026</span>
      <span>DVLA-registered supplier [CONFIRM] · Prices and copy are placeholders</span>
    </div>
  </footer>
</div>`; }
}

render(html`<${App} />`, document.getElementById('app'));
