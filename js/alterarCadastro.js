// クライアント側での写真のアップロード処理
const updateForm = document.getElementById('updateForm');
updateForm.addEventListener('submit', function(event) {
    event.preventDefault(); // フォームの通常の送信を防止
    
    const formData = new FormData(updateForm); // フォームデータを作成
    const id_aluno = 1; // 表示したい学生のID
    const url = `${apiUrlAluno}/${id_aluno}`;
    
    fetch(url, {
        method: 'POST',
        body: formData // フォームデータを送信
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // データの処理
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
