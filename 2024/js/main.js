const infoUrl = "https://www.hiroshima-cu.ac.jp/campuslife/content0110/";
const twiiterUrl = "https://x.com/";
const instagramUrl = "https://instagram.com/";
const youtubeUrl = "https://www.youtube.com/@";
const unionDataUrl = "union-data.json";

function composeFor(union) {
    let html = "";
    // 画像
    html += `<img id=${union.id} src="img/${union.id}.webp" onError="this.src='https://placehold.co/600x400?text=NotFound';" width="100%" loading="lazy" />`;
    // 名前
    html += `<span style="display: block; text-align: center; font-weight: bold;">${union.name}</span>`;
    // 短文紹介
    html += `<span style="display: block; text-align: center">${union.description}</span>`;
    html += "<section>";
    // 各種リンク
    for (let userName of union.info){
        html += `<a href="${infoUrl + userName}" class="btn_link" target="_blank" rel="noopener noreferrer">クラブ・サークル情報</a>`;
    }
    for (let userName of union.twitter){
        html += `<a href="${twiiterUrl + userName}" class="btn_link" target="_blank" rel="noopener noreferrer">
                    <i style="font-size: 1.8em"class="fa-brands fa-x-twitter"></i>
                    &nbsp;@${userName}
                </a>`;
    }
    for (let userName of union.instagram){
        html += `<a href="${instagramUrl + userName}" class="btn_link" target="_blank" rel="noopener noreferrer">
                    <i style="font-size: 1.8em" class="fa-brands fa-instagram"></i>
                    &nbsp;@${userName}
                </a>`;
    }
    for (let userName of union.youtube){
        html += `<a href="${youtubeUrl + userName}" class="btn_link" target="_blank" rel="noopener noreferrer">
                    <i style="font-size: 1.8em" class="fa-brands fa-youtube"></i>
                    &nbsp;@${userName}
                </a>`;
    }
    for (let url of union.original){
        html += `<a href="${url}" class="btn_link" target="_blank" rel="noopener noreferrer">Web サイト</a>`;
    }
    html += "</section><hr />"
    return html;
}

function composePage(json){
	let html = "";
    html += "<hr />";
    html += "<h2>体育系クラブ 全21団体</h2><hr />";
    for (let union of json.sportsClub){
        html += composeFor(union);
    }
    html += "他6団体";
    html += "<hr />";
    html += "<h2>文化系クラブ 全22団体</h2><hr />";
    for (let union of json.cultureClub){
        html += composeFor(union);
    }
    html += "他3団体";
    html += "<hr />";
    html += "<h2>文化系サークル・その他の団体 全8団体</h2><hr />";
    for (let union of json.others){
        html += composeFor(union);
    }
    html += "他3団体";
    html += "<hr />";
	document.getElementById("result").innerHTML = html;
}

function getCategoryKey(category) {
    switch (category) {
        case 'a':
            return 'sportsClub';
        case 'b':
            return 'cultureClub';
        case 'c':
            return 'others';
        default:
            return null;
    }
}

function composeTable(json){
    const order = [];
    let html = "";

    const category = ["sportsClub", "cultureClub", "others"];
    category.forEach((genre)=>{
        json[genre].forEach((data) => {
            order.push(data["id"]);
        });
    })

    for (let unionId of order) {
        const [category, index] = unionId.split('-');
        const categoryKey = getCategoryKey(category);

        const result = json[categoryKey].find(item => item.id === unionId);
        const name = result.name;

        html += `<a class="item" href="#${unionId}">${name}</a>`
    }
    document.getElementById("table").innerHTML = html;
}

window.addEventListener("load", ()=>{
	fetch(unionDataUrl)
		.then( response => response.json())
		.then( (json) => {
            composeTable(json);
            composePage(json);
        })
        .then(()=>{
            const items = document.querySelectorAll('.item');
            items.forEach(item => {
            const containerWidth = item.clientWidth; // 要素の幅
            const contentWidth = item.scrollWidth; // コンテンツの幅
            const fontSize = parseFloat(window.getComputedStyle(item).fontSize); // 現在のフォントサイズ
            if (contentWidth > containerWidth) {
                const ratio = containerWidth / contentWidth;
                const newFontSize = fontSize * ratio;
                item.style.fontSize = `${newFontSize-1}px`;
            }
            });
        });
});
