document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input");
    const chatBox = document.getElementById("chat-box");
    const sendButton = document.getElementById("send-chat");

    sendButton.addEventListener("click", async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Display user message
        chatBox.innerHTML += `<p><strong>Tú:</strong> ${message}</p>`;
        chatInput.value = "";

        try {
            const response = await fetch("/chat/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            if (response.ok) {
                chatBox.innerHTML += `<p><strong>🤖 AI:</strong> ${data.response}</p>`;
                chatBox.scrollTop = chatBox.scrollHeight;
            } else {
                chatBox.innerHTML += `<p><strong>🤖 AI:</strong> Error en el servidor.</p>`;
            }
        } catch (error) {
            chatBox.innerHTML += `<p><strong>🤖 AI:</strong> No se pudo conectar al servicio.</p>`;
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const chatToggle = document.getElementById("chat-toggle");
    const chatWindow = document.getElementById("chat-window");
    const chatClose = document.getElementById("chat-close");
    const chatInput = document.getElementById("chat-input");
    const chatBox = document.getElementById("chat-box");
    const sendButton = document.getElementById("send-chat");

    // Show/hide chat window
    chatToggle.addEventListener("click", () => {
        chatWindow.style.display = chatWindow.style.display === "block" ? "none" : "block";
    });

    // Close chat window
    chatClose.addEventListener("click", () => {
        chatWindow.style.display = "none";
    });

    // Send user message
    sendButton.addEventListener("click", async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Display user message
        chatBox.innerHTML += `<p><strong>Tú:</strong> ${message}</p>`;
        chatInput.value = "";

        try {
            const response = await fetch("/chat/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            if (response.ok) {
                chatBox.innerHTML += `<p><strong>🤖 AI:</strong> ${data.response}</p>`;
                chatBox.scrollTop = chatBox.scrollHeight;
            } else {
                chatBox.innerHTML += `<p><strong>🤖 AI:</strong> Error en el servidor.</p>`;
            }
        } catch (error) {
            chatBox.innerHTML += `<p><strong>🤖 AI:</strong> No se pudo conectar al servicio.</p>`;
        }
    });
});
