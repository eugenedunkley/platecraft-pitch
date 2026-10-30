import { html, render, Component } from '/vendor/preact-htm.js';
import { Plate } from '/plate.js';

const FINISHES = [
  { id: 'standard', name: 'Printed', pair: 24.99, single: 14.99, note: 'Classic flat print' },
  { id: 'gel', name: '3D Gel', pair: 34.99, single: 20.99, note: 'Glossy domed letters' },
  { id: '4d3', name: '4D 3mm', pair: 44.99, single: 26.99, note: 'Laser-cut raised acrylic', tag: 'Most popular' },
  { id: '4d5', name: '4D 5mm', pair: 49.99, single: 29.99, note: 'Deeper cut, bolder shadow' },
  { id: '5d', name: '5D Gel', pair: 59.99, single: 35.99, note: '4D acrylic with gel dome' }
];
const NEEDS = [{ id: 'pair', label: 'Pair' }, { id: 'front', label: 'Front' }, { id: 'rear', label: 'Rear' }];
const clean = (v) => String(v || '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ').slice(0, 8);
const gbp = (n) => '£' + n.toFixed(2);

class Builder extends Component {
  constructor() {
    super();
    this.state = { reg: 'AB12 CDE', finish: '4d3', need: 'pair', ordered: false };
    this.onHero = (e) => { this.setState({ reg: clean(e.target.value), ordered: false }); };
  }
  componentDidMount() {
    const input = document.getElementById('hero-reg');
    const form = document.getElementById('hero-form');
    if (input) input.addEventListener('input', this.onHero);
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('build').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
  setReg(v) {
    const reg = clean(v);
    this.setState({ reg, ordered: false });
    const hero = document.getElementById('hero-reg');
    if (hero && hero.value !== reg) hero.value = reg;
  }
  render() {
    const { reg, finish, need, ordered } = this.state;
    const shown = reg.trim() || 'YOUR REG';
    const cur = FINISHES.find((f) => f.id === finish);
    const price = need === 'pair' ? cur.pair : cur.single;
    const w = need === 'pair' ? 440 : 520;
    return html`
      <div class="grid">
        <div class="preview" role="img" aria-label=${'Live preview of ' + shown + ' in ' + cur.name}>
          ${need !== 'rear' ? html`<div class="plate-scale"><${Plate} reg=${shown} finish=${finish} side="front" badge="uk" border="none" font="legal" plateWidth=${w} /><div class="tag">FRONT · WHITE</div></div>` : null}
          ${need !== 'front' ? html`<div class="plate-scale"><${Plate} reg=${shown} finish=${finish} side="rear" badge="uk" border="none" font="legal" plateWidth=${w} /><div class="tag">REAR · YELLOW</div></div>` : null}
        </div>
        <div class="panel">
          <div>
            <label class="step" for="b-reg">1 · YOUR REG</label>
            <input class="field" id="b-reg" value=${reg} onInput=${(e) => this.setReg(e.target.value)} maxlength="8" autocomplete="off" spellcheck="false" />
          </div>
          <div>
            <p class="step" id="f-lbl">2 · FINISH</p>
            <div class="opts" role="group" aria-labelledby="f-lbl">
              ${FINISHES.map((f) => html`
                <button type="button" class="opt" aria-pressed=${String(f.id === finish)} onClick=${() => this.setState({ finish: f.id, ordered: false })}>
                  <span>${f.name}${f.tag ? html` <span style="font-size:11px;font-weight:800;letter-spacing:.08em;color:#0A0B0F;background:#7CC4FF;border-radius:999px;padding:2px 8px;margin-left:6px;vertical-align:2px">${f.tag.toUpperCase()}</span>` : null}<small>${f.note}</small></span>
                  <span class="p">${gbp(need === 'pair' ? f.pair : f.single)}</span>
                </button>`)}
            </div>
          </div>
          <div>
            <p class="step" id="n-lbl">3 · PLATES</p>
            <div class="seg" role="group" aria-labelledby="n-lbl">
              ${NEEDS.map((n) => html`<button type="button" aria-pressed=${String(n.id === need)} onClick=${() => this.setState({ need: n.id, ordered: false })}>${n.label}</button>`)}
            </div>
          </div>
          <div class="total">
            <div class="total-row"><span style="color:#C9CED8">Total</span><strong>${gbp(price)}</strong></div>
            <span style="font-size:13px;color:#9AA1AE;text-align:right">${(need === 'pair' ? 'Pair' : 'Single ' + need + ' plate') + ' · ' + cur.name + ' · free tracked delivery'}</span>
            ${ordered
              ? html`<div class="done" role="status"><b>Added: ${shown} · ${cur.name} · ${gbp(price)}</b><span>Secure checkout (Stripe, Apple Pay, Google Pay) connects here in the live build.</span></div>`
              : html`<button type="button" class="buy" onClick=${() => this.setState({ ordered: true })}>Buy now · ${gbp(price)}</button>`}
            <p class="fine">Road-legal to BS AU 145e · Proof of entitlement required at checkout</p>
          </div>
        </div>
      </div>`;
  }
}

const mount = document.getElementById('builder');
mount.innerHTML = '';
render(html`<${Builder} />`, mount);
