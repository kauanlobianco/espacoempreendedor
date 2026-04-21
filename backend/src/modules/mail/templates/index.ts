const layout = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
  .container{max-width:600px;margin:32px auto;background:#fff;border-radius:8px;padding:32px}
  h2{color:#1a3c5e;margin-top:0}
  .badge{display:inline-block;padding:4px 10px;border-radius:4px;font-size:13px;font-weight:bold;background:#e8f4fd;color:#1a3c5e}
  .token{font-size:20px;font-weight:bold;letter-spacing:2px;color:#1a3c5e;padding:12px 0}
  .footer{margin-top:24px;font-size:12px;color:#888}
</style></head>
<body><div class="container">${content}<div class="footer">Espaço Empreendedor — plataforma universitária de atendimento MEI</div></div></body>
</html>`;

export function requestReceivedTemplate(params: {
  fullName: string;
  category: string;
  trackingToken: string;
}) {
  return layout(`
    <h2>Solicitação recebida</h2>
    <p>Olá, <strong>${params.fullName}</strong>.</p>
    <p>Sua solicitação na categoria <span class="badge">${params.category.replace(/_/g, ' ')}</span> foi recebida com sucesso.</p>
    <p>Anote seu <strong>token de rastreio</strong> para acompanhar o andamento:</p>
    <div class="token">${params.trackingToken}</div>
    <p>Você pode verificar o status a qualquer momento em nosso site.</p>
  `);
}

export function caseAssignedTemplate(params: {
  studentName: string;
  caseCode: string;
  category: string;
}) {
  return layout(`
    <h2>Novo caso atribuído</h2>
    <p>Olá, <strong>${params.studentName}</strong>.</p>
    <p>O caso <span class="badge">${params.caseCode}</span> da categoria
    <span class="badge">${params.category.replace(/_/g, ' ')}</span> foi atribuído a você.</p>
    <p>Acesse a plataforma para iniciar o atendimento.</p>
  `);
}

export function caseStatusChangedTemplate(params: {
  caseCode: string;
  fromStatus: string;
  toStatus: string;
  actorName: string;
}) {
  return layout(`
    <h2>Status atualizado — ${params.caseCode}</h2>
    <p><strong>${params.actorName}</strong> atualizou o status do caso:</p>
    <p><span class="badge">${params.fromStatus}</span> → <span class="badge">${params.toStatus}</span></p>
  `);
}

export function validationDecidedTemplate(params: {
  studentName: string;
  status: string;
  target: string;
  comment?: string;
}) {
  const color = params.status === 'APPROVED' ? '#27ae60' : '#e74c3c';
  const label = params.status === 'APPROVED' ? 'APROVADO' : 'REPROVADO';
  return layout(`
    <h2>Validação de ${params.target === 'ATTENDANCE' ? 'atendimento' : 'horas extensionistas'}</h2>
    <p>Olá, <strong>${params.studentName}</strong>.</p>
    <p>Sua submissão foi <strong style="color:${color}">${label}</strong>.</p>
    ${params.comment ? `<p><em>Comentário do professor:</em> ${params.comment}</p>` : ''}
  `);
}
