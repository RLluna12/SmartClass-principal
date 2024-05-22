// disciplina.js

document.addEventListener('DOMContentLoaded', () => {
  // URLパラメーターからDisciplinaの情報を取得する
  const urlParams = new URLSearchParams(window.location.search);
  const disciplinaNome = urlParams.get('disciplina');
  const disciplinaHorario = urlParams.get('horario');

  // フォームの要素を取得する
  const nomeDisciplinaInput = document.getElementById('nomeDisciplina');
  const horarioInput = document.getElementById('horario');

  // フォームにDisciplinaの情報を設定する
  nomeDisciplinaInput.value = disciplinaNome;
  horarioInput.value = disciplinaHorario;

  // フォームの送信イベントを処理する
  const gradeForm = document.getElementById('gradeForm');
  gradeForm.addEventListener('submit', (event) => {
    event.preventDefault(); // フォームのデフォルトの送信を防止する

    // フォームの入力値を取得する
    const notaN1 = document.getElementById('notaN1').value;
    const notaAP = document.getElementById('notaAP').value;
    const notaAI = document.getElementById('notaAI').value;

    // ここで取得した成績をサーバーに送信するか、ローカルで処理するなどの処理を実装する
    // この例ではアラートで表示する
    alert(`Nota N1: ${notaN1}, Nota AP: ${notaAP}, Nota AI: ${notaAI}`);
  });
});
