import './style.css';
import faultTree from './data/fault-tree.json';

const codes = ['HMC – 9200', 'MPS – 9600', 'MPNS – 9100', 'HAC – 9700'];
const statuses = ['Liberado', 'Em manutenção', 'Aguardando recurso', 'Aguardando componente'];
const blankAppointment = () => ({ asset: '', code: codes[0], system: '', component: '', subcomponent: '', cause: '', faultSolution: '', diagnosis: '', solution: '', status: 'Liberado' });
const state = {
  date: new Date().toISOString().slice(0, 10), shift: '06:00 às 18:00', team: '', supervisor: '', executors: '',
  conclusion: '', appointments: [blankAppointment()], stopped: [{ asset: '', code: codes[0] }],
};
const app = document.querySelector('#app');
const systems = Object.keys(faultTree);
const emoji = {
  clipboard: String.fromCodePoint(0x1F4CB),
  calendar: String.fromCodePoint(0x1F4C5),
  clock: String.fromCodePoint(0x23F0),
  worker: String.fromCodePoint(0x1F477),
  compass: String.fromCodePoint(0x1F9ED),
  mechanic: `${String.fromCodePoint(0x1F468)}\u200D${String.fromCodePoint(0x1F527)}`,
  gear: `${String.fromCodePoint(0x2699)}\uFE0F`,
  cross: String.fromCodePoint(0x274C),
  tools: `${String.fromCodePoint(0x1F6E0)}\uFE0F`,
  check: String.fromCodePoint(0x2705),
  pin: String.fromCodePoint(0x1F4CC),
  noEntry: String.fromCodePoint(0x1F6AB),
};

function options(values, selected = '') {
  return `<option value="">Selecione</option>${values.map((value) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>`).join('')}`;
}
function field(label, key, value, type = 'text', placeholder = '', scope = '') {
  const binding = scope ? `data-appt="${scope}" data-key="${key}"` : `data-global="${key}"`;
  return `<label class="field"><span>${label}</span><${type === 'textarea' ? 'textarea' : 'input'} ${binding} type="${type}" placeholder="${placeholder}">${type === 'textarea' ? value || '' : ''}</${type === 'textarea' ? 'textarea' : 'input'}>`;
}
function select(label, key, values, selected, disabled, index) {
  const binding = index === '' ? `data-global="${key}"` : `data-appt="${index}" data-key="${key}"`;
  return `<label class="field"><span>${label}</span><select ${binding} ${disabled ? 'disabled' : ''}>${options(values, selected)}</select></label>`;
}
function codeSelect(index) { return select('Código de manutenção', 'code', codes, state.appointments[index].code, false, index); }
function branches(item) {
  const system = faultTree[item.system] || {};
  const component = system[item.component] || {};
  const subcomponent = component[item.subcomponent] || {};
  return { components: Object.keys(system), subcomponents: Object.keys(component), causes: Object.keys(subcomponent), solutions: subcomponent[item.cause] || [] };
}
function appointmentCard(item, index) {
  const branch = branches(item);
  return `<article class="appointment"><div class="section-title"><h3>Atendimento ${index + 1}</h3>${state.appointments.length > 1 ? `<button type="button" class="remove remove-appointment" data-remove-appointment="${index}">Remover</button>` : ''}</div>
    <div class="grid two">${field('Ativo / CM', 'asset', item.asset, 'text', 'Ex.: CM5516', index)}${codeSelect(index)}</div>
    <div class="grid five">${select('1. Sistema', 'system', systems, item.system, false, index)}${select('2. Componente', 'component', branch.components, item.component, !item.system, index)}${select('3. Subcomponente', 'subcomponent', branch.subcomponents, item.subcomponent, !item.component, index)}${select('4. Causa', 'cause', branch.causes, item.cause, !item.subcomponent, index)}${select('5. Solução', 'faultSolution', branch.solutions, item.faultSolution, !item.cause, index)}</div>
    <div class="grid two">${field('Diagnóstico executado', 'diagnosis', item.diagnosis, 'textarea', 'Verificações e testes realizados', index)}${field('Solução aplicada', 'solution', item.solution, 'textarea', 'Serviço realizado', index)}</div>
    <div class="status-grid">${statuses.map((status) => `<label class="status-option"><input type="radio" name="status-${index}" data-appt="${index}" data-key="status" value="${status}" ${item.status === status ? 'checked' : ''}><span>${status}</span></label>`).join('')}</div>
  </article>`;
}
function render() {
  app.innerHTML = `<main class="page"><header class="hero"><div><p class="eyebrow">Manutenção corretiva</p><h1>Relatório de turno</h1><p class="subtitle">Preencha os atendimentos e gere WhatsApp ou ficha PDF.</p></div><div class="brand">SOTREQ <strong>CAT</strong></div></header>
  <form id="report-form" class="card"><section><h2>Dados do turno</h2><div class="grid three">${field('Data', 'date', state.date, 'date')}${select('Turno', 'shift', ['06:00 às 18:00', '18:00 às 06:00'], state.shift, false, '')}${field('Turma', 'team', state.team, 'text', 'Ex.: B')}</div><div class="grid two">${field('Supervisor', 'supervisor', state.supervisor, 'text', 'Nome do supervisor')}${field('Executantes', 'executors', state.executors, 'textarea', 'Um nome por linha')}</div></section>
  <section><div class="section-title"><h2>Ativos em manutenção</h2><button type="button" class="small primary" id="add-appointment">+ Adicionar atendimento</button></div><p class="hint">Adicione outro atendimento quando houver mais de um equipamento trabalhado no turno.</p>${state.appointments.map(appointmentCard).join('')}</section>
  <section><h2>Observações / conclusão</h2>${field('Informações adicionais', 'conclusion', state.conclusion, 'textarea', 'Observações gerais do turno')}</section>
  <section><div class="section-title"><h2>Equipamentos parados</h2><button type="button" class="small primary" id="add-stopped">+ Adicionar equipamento</button></div><div id="stopped-list">${state.stopped.map((item, index) => `<div class="stopped-row"><input data-stopped="${index}" data-key="asset" value="${item.asset}" placeholder="Ex.: CM5516"><select data-stopped="${index}" data-key="code">${options(codes, item.code)}</select><button type="button" class="remove" data-remove="${index}">×</button></div>`).join('')}</div></section>
  <div class="actions"><button type="button" class="secondary" id="clear-button">Limpar</button><button type="submit" class="primary">Gerar WhatsApp</button></div></form>
  <section id="whatsapp-preview" class="card preview hidden"><div class="preview-heading"><div><p class="eyebrow">Saída WhatsApp</p><h2>Mensagem do relatório</h2></div><button type="button" class="close" id="close-whatsapp">×</button></div><pre id="report-text"></pre><div class="preview-actions"><button type="button" class="outline" id="copy-button">Copiar mensagem</button><button type="button" class="primary" id="whatsapp-button">Abrir no WhatsApp</button></div></section>
  </main>`;
  bind();
}
function bind() {
  document.querySelectorAll('[data-global]').forEach((el) => {
    const key = el.dataset.key; el.value = state[key] || '';
    el.addEventListener('input', () => { state[key] = el.value; }); el.addEventListener('change', () => { state[key] = el.value; });
  });
  document.querySelectorAll('[data-appt][data-key]').forEach((el) => {
    const index = el.dataset.appt; if (index === '') return;
    const key = el.dataset.key; el.value = state.appointments[index][key] || '';
    el.addEventListener('input', () => { state.appointments[index][key] = el.value; });
    el.addEventListener('change', () => {
      state.appointments[index][key] = el.value;
      const resets = { system: ['component', 'subcomponent', 'cause', 'faultSolution'], component: ['subcomponent', 'cause', 'faultSolution'], subcomponent: ['cause', 'faultSolution'], cause: ['faultSolution'] };
      (resets[key] || []).forEach((reset) => { state.appointments[index][reset] = ''; }); if (resets[key]) render();
    });
  });
  document.querySelectorAll('[data-stopped]').forEach((el) => el.addEventListener('input', () => { state.stopped[el.dataset.stopped][el.dataset.key] = el.value; }));
  document.querySelectorAll('[data-remove]').forEach((el) => el.addEventListener('click', () => { state.stopped.splice(Number(el.dataset.remove), 1); render(); }));
  document.querySelectorAll('[data-remove-appointment]').forEach((el) => el.addEventListener('click', () => { state.appointments.splice(Number(el.dataset.removeAppointment), 1); render(); }));
  document.querySelector('#add-appointment').addEventListener('click', () => { state.appointments.push(blankAppointment()); render(); });
  document.querySelector('#add-stopped').addEventListener('click', () => { state.stopped.push({ asset: '', code: codes[0] }); render(); });
  document.querySelector('#report-form').addEventListener('submit', showWhatsapp);
  document.querySelector('#clear-button').addEventListener('click', () => { state.appointments = [blankAppointment()]; state.stopped = [{ asset: '', code: codes[0] }]; state.team = ''; state.supervisor = ''; state.executors = ''; state.conclusion = ''; render(); });
  document.querySelector('#close-whatsapp').addEventListener('click', () => document.querySelector('#whatsapp-preview').classList.add('hidden'));
}
function dateText() { return state.date ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${state.date}T12:00:00`)) : '-'; }
function path(item) { return [item.system, item.component, item.subcomponent, item.cause, item.faultSolution].filter(Boolean).join(' > ') || 'Não informada'; }
function stoppedText() { return state.stopped.filter((item) => item.asset.trim()).map((item) => `${emoji.gear} ${item.asset} | Código: ${item.code}`).join('\n') || 'Nenhum equipamento informado'; }
function makeReport() {
  const appointments = state.appointments.map((item) => `${emoji.gear} ${item.asset || 'Ativo não informado'} | Código: ${item.code}\n\n${emoji.cross} CLASSE DA FALHA\n${path(item)}\n\n${emoji.tools} DIAGNÓSTICO EXECUTADO\n${item.diagnosis || 'Não informado'}\n\n${emoji.check} SOLUÇÃO APLICADA\n${item.solution || 'Não informada'}\n\n${emoji.pin} STATUS FINAL: ${item.status}`).join('\n\n____________________________________\n\n');
  return `Boa noite!\n\n${emoji.clipboard} RELATÓRIO DE TURNO – MANUTENÇÃO CORRETIVA\n\n${emoji.calendar} Data: ${dateText()}\n${emoji.clock} Turno: ${state.shift}\n${emoji.worker} Turma: ${state.team || 'Não informado'}\n${emoji.compass} Supervisor: ${state.supervisor || 'Não informado'}\n${emoji.mechanic} Executantes:\n${state.executors || 'Não informado'}\n\n____________________________________\n\nATENDIMENTO DOS ATIVOS EM MANUTENÇÃO\n\n${appointments}\n\n${emoji.noEntry} EQUIPAMENTOS PARADOS\n${stoppedText()}`;
}
function showWhatsapp(event) {
  event.preventDefault();
  const report = makeReport();
  document.querySelector('#report-text').textContent = report;
  document.querySelector('#whatsapp-preview').classList.remove('hidden');
  document.querySelector('#whatsapp-button').onclick = () => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(report)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };
  document.querySelector('#copy-button').onclick = async () => {
    await navigator.clipboard.writeText(report);
    document.querySelector('#copy-button').textContent = 'Mensagem copiada';
  };
  document.querySelector('#whatsapp-preview').scrollIntoView({ behavior: 'smooth' });
}
render();
