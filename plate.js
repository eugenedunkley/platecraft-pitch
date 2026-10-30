import { html, Component } from '/vendor/preact-htm.js';
export 
class Plate extends Component {
  renderVals() {
    const p = this.props;
    const w = Math.max(80, Number(p.plateWidth ?? 520) || 520);
    const u = w / 520;
    const raw = String(p.reg ?? 'AB12 CDE').toUpperCase().replace(/\s+/g, ' ').trim() || 'AB12 CDE';
    const finish = p.finish ?? '4d3';
    const side = p.side ?? 'rear';
    const border = p.border ?? 'none';
    const badge = p.badge ?? 'uk';
    const font = p.font ?? 'legal';
    const f2 = (n) => Number(n).toFixed(2);

    const FONTS = {
      legal: { fam: "'Barlow Condensed', 'Arial Narrow', sans-serif", fw: 600, fst: 'normal', capRatio: 0.7, skew: 'scaleX(0.88)' },
      italic: { fam: "'Barlow Condensed', 'Arial Narrow', sans-serif", fw: 700, fst: 'italic', capRatio: 0.7, skew: 'none' },
      block: { fam: "Anton, Impact, sans-serif", fw: 400, fst: 'normal', capRatio: 0.73, skew: 'none' },
      script: { fam: "'Kaushan Script', cursive", fw: 400, fst: 'normal', capRatio: 0.68, skew: 'none' }
    };
    const F = FONTS[font] || FONTS.legal;

    const hasBadge = badge === 'uk';
    const margin = 11;
    const badgeW = 46;
    const badgeX = 6;
    const leftMm = hasBadge ? badgeX + badgeW + 6 : margin;
    const avail = 520 - leftMm - margin;

    const items = [];
    for (const ch of raw) {
      if (ch === ' ') { if (items.length) items[items.length - 1].gap = 33; continue; }
      items.push({ ch: ch, gap: 11 });
    }
    if (items.length) items[items.length - 1].gap = 0;
    let need = 0;
    items.forEach((it) => { need += 50 + it.gap; });
    const fit = need > avail ? avail / need : 1;
    const k = u * fit;
    const chars = items.map((it) => ({ ch: it.ch, mr: f2(it.gap * k) }));

    const depth = { standard: 0, gel: 0, '4d3': 3, '4d5': 5, '5d': 5 }[finish] || 0;
    const parts = [];
    let dx = 0, dy = 0;
    if (depth) {
      dy = depth * u * 1.15;
      dx = dy * 0.5;
      const steps = Math.max(3, Math.ceil(dy * 1.4));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const c = Math.round(58 - 42 * t);
        parts.push(f2(dx * t) + 'px ' + f2(dy * t) + 'px 0 rgb(' + c + ',' + c + ',' + (c + 3) + ')');
      }
      parts.push(f2(dx + 1.5 * u) + 'px ' + f2(dy + 2.5 * u) + 'px ' + f2(3.5 * u) + 'px rgba(0,0,0,.45)');
      parts.push(f2(dx + 5 * u) + 'px ' + f2(dy + 8 * u) + 'px ' + f2(11 * u) + 'px rgba(0,0,0,.18)');
    } else if (finish === 'gel') {
      parts.push('0 ' + f2(0.9 * u) + 'px 0 rgba(0,0,0,.6)');
      parts.push('0 ' + f2(2.2 * u) + 'px ' + f2(2.6 * u) + 'px rgba(0,0,0,.3)');
    }
    const glossBy = { standard: 0, gel: 0.95, '4d3': 0.32, '4d5': 0.36, '5d': 1 };

    const NAMES = { standard: 'Printed', gel: '3D Gel', '4d3': '4D 3mm', '4d5': '4D 5mm', '5d': '5D Gel' };
    const BCOL = { none: 'transparent', black: '#121212', blue: '#0B3D91' };
    return {
      w: w,
      h: Math.round(111 * u),
      radius: f2(7 * u),
      dot: f2(Math.max(2, 3 * u)),
      edge: f2(Math.max(0.6, 0.8 * u)),
      plateBg: side === 'front'
        ? 'linear-gradient(165deg, #FFFFFF 0%, #F4F4F0 50%, #E6E6E0 100%)'
        : 'linear-gradient(165deg, #FFD93A 0%, #F7C600 50%, #E7B300 100%)',
      plateShadow: '0 ' + f2(8 * u) + 'px ' + f2(18 * u) + 'px rgba(0,0,0,.5), 0 ' + f2(1.5 * u) + 'px ' + f2(2.5 * u) + 'px rgba(0,0,0,.35)',
      bInset: f2(3.5 * u),
      bWidth: f2(Math.max(1, 2.4 * u)),
      bColor: BCOL[border] || 'transparent',
      bRadius: f2(4.5 * u),
      hasBadge: hasBadge,
      badgeX: f2(badgeX * u),
      badgeY: f2(6 * u),
      badgeW: f2(badgeW * u),
      badgeR: f2(3.5 * u),
      badgeGap: f2(9 * u),
      flagW: f2(34 * u),
      flagH: f2(17 * u),
      ukSize: f2(24 * u),
      textL: f2(leftMm * u),
      textR: f2(margin * u),
      cw: f2(50 * k),
      fs: f2((79 / F.capRatio) * k),
      fam: F.fam,
      fw: F.fw,
      fst: F.fst,
      skew: F.skew,
      chars: chars,
      nudge: 'translate(' + f2(-dx / 2) + 'px, ' + f2(-dy / 2) + 'px)',
      textShadow: parts.length ? parts.join(', ') : 'none',
      gloss: glossBy[finish] || 0,
      mark: 'PLATECRAFT [POSTCODE]  BS AU 145e',
      markFs: f2(4.2 * u),
      markB: f2(2.8 * u),
      label: (side === 'front' ? 'Front' : 'Rear') + ' number plate reading ' + raw + ', ' + (NAMES[finish] || finish) + ' finish'
    };
  }
  render() { const V = this.renderVals(); return html`<div role="img" aria-label=${V.label} style="position: relative; width: ${V.w}px; height: ${V.h}px; box-sizing: border-box; border-radius: ${V.radius}px; background: ${V.plateBg}; box-shadow: ${V.plateShadow}; overflow: hidden; color: #0B0B0C">
  <div aria-hidden="true" style="position: absolute; inset: 0; background-image: radial-gradient(rgba(0,0,0,.05) 1px, rgba(0,0,0,0) 1.2px); background-size: ${V.dot}px ${V.dot}px; opacity: .55; pointer-events: none"></div>
  <div aria-hidden="true" style="position: absolute; inset: ${V.bInset}px; border: ${V.bWidth}px solid ${V.bColor}; border-radius: ${V.bRadius}px; pointer-events: none; z-index: 3"></div>
  ${V.hasBadge ? html`
    <div aria-hidden="true" style="position: absolute; z-index: 1; left: ${V.badgeX}px; top: ${V.badgeY}px; bottom: ${V.badgeY}px; width: ${V.badgeW}px; border-radius: ${V.badgeR}px; background: #0B3D91; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${V.badgeGap}px">
      <svg width=${V.flagW} height=${V.flagH} viewBox="0 0 60 30" aria-hidden="true"><rect width="60" height="30" fill="#012169"></rect><path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" stroke-width="6"></path><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="2"></path><path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" stroke-width="10"></path><path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"></path></svg>
      <span style="color: #FFFFFF; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: ${V.ukSize}px; line-height: 1">UK</span>
    </div>
  ` : null}
  <div style="position: absolute; z-index: 2; top: 0; bottom: 0; left: ${V.textL}px; right: ${V.textR}px; display: flex; align-items: center; justify-content: center">
    <div style="display: flex; align-items: center; transform: ${V.nudge}">
      ${(V.chars||[]).map((item, $index) => html`
        <span style="position: relative; flex: 0 0 auto; width: ${V.cw}px; margin-right: ${item.mr}px; display: flex; justify-content: center; align-items: center">
          <span class="glyph" style="font-family: ${V.fam}; font-weight: ${V.fw}; font-style: ${V.fst}; font-size: ${V.fs}px; transform: ${V.skew}; text-shadow: ${V.textShadow}">${item.ch}</span>
          <span class="glyph" aria-hidden="true" style="position: absolute; font-family: ${V.fam}; font-weight: ${V.fw}; font-style: ${V.fst}; font-size: ${V.fs}px; transform: ${V.skew}; color: transparent; background-image: linear-gradient(180deg, rgba(255,255,255,0) 4%, rgba(255,255,255,.85) 14%, rgba(255,255,255,.22) 36%, rgba(255,255,255,0) 52%, rgba(255,255,255,0) 86%, rgba(255,255,255,.18) 100%); -webkit-background-clip: text; background-clip: text; opacity: ${V.gloss}">${item.ch}</span>
        </span>
      `)}
    </div>
  </div>
  <span aria-hidden="true" style="position: absolute; z-index: 2; left: 0; right: 0; bottom: ${V.markB}px; text-align: center; font-family: Manrope, sans-serif; font-weight: 600; font-size: ${V.markFs}px; line-height: 1; letter-spacing: .04em; color: rgba(0,0,0,.55); white-space: nowrap">${V.mark}</span>
  <div aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(112deg, rgba(255,255,255,.5) 0%, rgba(255,255,255,.08) 22%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 74%, rgba(255,255,255,.16) 100%); pointer-events: none; z-index: 4"></div>
  <div aria-hidden="true" style="position: absolute; inset: 0; border-radius: ${V.radius}px; box-shadow: inset 0 ${V.edge}px 0 rgba(255,255,255,.7), inset 0 -${V.edge}px 0 rgba(0,0,0,.18); pointer-events: none; z-index: 4"></div>
</div>`; }
}
