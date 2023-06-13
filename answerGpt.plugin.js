/**
 * @name answerGpt
 * @author aqua6858
 * @description auto generate answer via gpt3.5
 * @version 1.0.0
 */

let gptLogo = `<svg width="24" xmlns="http://www.w3.org/2000/svg" viewBox="300 300 1806 1806"><path d="M1107.3 299.1c-198 0-373.9 127.3-435.2 315.3C544.8 640.6 434.9 720.2 370.5 833c-99.3 171.4-76.6 386.9 56.4 533.8-41.1 123.1-27 257.7 38.6 369.2 98.7 172 297.3 260.2 491.6 219.2 86.1 97 209.8 152.3 339.6 151.8 198 0 373.9-127.3 435.3-315.3 127.5-26.3 237.2-105.9 301-218.5 99.9-171.4 77.2-386.9-55.8-533.9v-.6c41.1-123.1 27-257.8-38.6-369.8-98.7-171.4-297.3-259.6-491-218.6-86.6-96.8-210.5-151.8-340.3-151.2zm0 117.5-.6.6c79.7 0 156.3 27.5 217.6 78.4-2.5 1.2-7.4 4.3-11 6.1L952.8 709.3c-18.4 10.4-29.4 30-29.4 51.4V1248l-155.1-89.4V755.8c-.1-187.1 151.6-338.9 339-339.2zm434.2 141.9c121.6-.2 234 64.5 294.7 169.8 39.2 68.6 53.9 148.8 40.4 226.5-2.5-1.8-7.3-4.3-10.4-6.1l-360.4-208.2c-18.4-10.4-41-10.4-59.4 0L1024 984.2V805.4L1372.7 604c51.3-29.7 109.5-45.4 168.8-45.5zM650 743.5v427.9c0 21.4 11 40.4 29.4 51.4l421.7 243-155.7 90L597.2 1355c-162-93.8-217.4-300.9-123.8-462.8C513.1 823.6 575.5 771 650 743.5zm807.9 106 348.8 200.8c162.5 93.7 217.6 300.6 123.8 462.8l.6.6c-39.8 68.6-102.4 121.2-176.5 148.2v-428c0-21.4-11-41-29.4-51.4l-422.3-243.7 155-89.3zM1201.7 997l177.8 102.8v205.1l-177.8 102.8-177.8-102.8v-205.1L1201.7 997zm279.5 161.6 155.1 89.4v402.2c0 187.3-152 339.2-339 339.2v-.6c-79.1 0-156.3-27.6-217-78.4 2.5-1.2 8-4.3 11-6.1l360.4-207.5c18.4-10.4 30-30 29.4-51.4l.1-486.8zM1380 1421.9v178.8l-348.8 200.8c-162.5 93.1-369.6 38-463.4-123.7h.6c-39.8-68-54-148.8-40.5-226.5 2.5 1.8 7.4 4.3 10.4 6.1l360.4 208.2c18.4 10.4 41 10.4 59.4 0l421.9-243.7z" fill="white" style="fill:  currentcolor;"/></svg>`

let buttonString = `<button id="gpt" aria-haspopup="dialog" aria-label="generate answer" type="button" class="button-ejjZWC lookBlank-FgPMy6 colorBrand-2M3O3N grow-2T4nbg"><div class="contents-3NembX button-2fCJ0o button-3BaQ4X"><div class="buttonWrapper-3YFQGJ" style="opacity: 1; transform: none;">${gptLogo}</div></div></button>`
let cross = `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm3.707,14.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414l-2.293,2.293,2.293,2.293Z"/></svg>`

const apis = [
    'your api key'
]
let token
let notes = {};
let chats = {};
let user;

const getToken = () => {
    let token = (webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
    return token;
}

const prepareMessages = () => {
    let messages = document.querySelectorAll(".markup-eYLPri.messageContent-2t3eCI");
    let messagesArray = [];
    messages.forEach(message => {
        if(!message.parentElement.childNodes[1]) return;
        let author = message.parentElement.childNodes[1].innerText.split('\n')[0]
        let content = message.innerText;
        messagesArray.push((author === user.global_name ? 'You' : 'Interlocutor') + ': ' + content);;
    })
    messagesArray = messagesArray.reverse();
    messagesArray = messagesArray.splice(0, 15)
    let state = messagesArray[0].split(' ')[0];
    let lastMessages = [];
    while(messagesArray[0] && messagesArray[0].split(' ')[0] == state) {
        lastMessages.push(messagesArray.shift());
    }

    lastMessages = lastMessages.reverse().join('\n');
    messagesArray = messagesArray.reverse().join('\n');

    return {
        messages: messagesArray,
        lastMessages
    }
}

const generatePrompt = async () => {
    let { messages, lastMessages } = prepareMessages();

    let note = await getNotes(window.location.href.split('/')[5]);

return `Your name is Руслан. You are 19 years old.
You are funny, sweet and kind.
You communicate with your interlocutor in the discord.
Your nickname in discord is aqua.

Information about the interlocutor:
${note}.

You have a correspondence with your interlocutor:
${messages}

Last messages:
${lastMessages}

Reply in Russian on behalf of your character only to a last message.
Try not to repeat what you already wrote.
Don't ask too many questions.
Try to answer briefly.`
}

const getNotes = async (chatId) => {
    let chat = await getChat();
    if(!chat)  return 'nothing';
    let userId = chat.uid;
    if(notes[userId]) return  notes[userId];
    let res = await fetch(`https://discord.com/api/v9/users/@me/notes/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        }
    })
    res = await res.json();
    notes[userId] = res.note;
    return res.note;
}

const getUser = async () => {
    if(user) return user;
    let res = await fetch(`https://discord.com/api/v9/users/@me`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        }
    })
    res = await res.json();
    user = res;
    return res;
}

async function getChat() {
    let chatId = window.location.href.split('/')[5]
    if(chats[chatId]) return chats[chatId];
    let res = await fetch('https://discord.com/api/v9/channels/' + chatId, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        }
    })

    res = await res.json();
    if(!res.recipients) {
        chats[chatId] = false;
        return false;
    }
    res.uid = res.recipients[0].id
    chats[chatId] = res;
    return res;
} 

let id = 0;

async function generateAnswer() {
    let apiKey = apis[id % apis.length];
    id++;
    let prompt = await generatePrompt();
    let res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        })
    })
    res = await res.json();
    let answer = res.choices[0].message.content;

    if( answer.includes('Interlocutor:')) {
        answer =  answer.split('\n').filter(a => !a.includes('Interlocutor:')).join('\n')
    }

    answer.replace('You:', '')
    if(answer.includes('You:')) {
        answer = answer.replaceAll('You:', '\n')
    }

    if( answer.includes('] : '))
        answer =  answer.split('] : ')[1]
    else
    if( answer.includes(']: '))
        answer =  answer.split(']: ')[1]
    else
    if( answer.includes(': '))
        answer =  answer.split(':')[1]
    if( answer.includes(']'))
        answer =  answer.split(']')[1]
    answer = answer.trim();
    res.choices[0].message.content = answer;

    return res.choices[0].message.content;
}


function createElementFromString(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function addTextArea() {
    let element = document.querySelector('.channelTextArea-1FufC0.channelTextArea-1VQBuV');
    console.log(element)
    let div = document.createElement('div');
    div.id = 'textarea'
    div.style = 'padding: 10px; display: flex;'
    let textarea = document.createElement('textarea');
    textarea.style = 'width: 100%; background: #0000; border: none; color: white; resize: none; overflow-y:hidden; font-size: 14px;'
    textarea.style.height = textarea.scrollHeight + 'px'
    div.appendChild(textarea);
    let crossBtn = createElementFromString(cross);
    crossBtn.classList.add('crossBtn')
    crossBtn.addEventListener('click', removeTextArea)
    div.appendChild(crossBtn);
    element.prepend(div);

    textarea.addEventListener("input", OnInput, false);

    function OnInput() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    }

    return textarea;
}

async function enter(e) {
    if (e.key === 'Enter') {
        console.log(e)
        sendMessage()
        removeTextArea()
    }
}

function removeTextArea() {
    let element = document.querySelector('#textarea');
    element.remove();
}

async function sendMessage() {
    let channel = window.location.href.split('/')[5];
    let content = document.querySelector('#textarea textarea').value;
    await fetch(`https://discord.com/api/v9/channels/${channel}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content
        })
    })
}

module.exports = class AnswerGpt {

    observer() {
        let gpt = document.getElementById("gpt");
        if(!gpt) {
            let chatButtons = document.querySelector(".buttons-uaqb-5");
            if(!chatButtons) return;
            let gptButton = createElementFromString(buttonString);
            chatButtons.prepend(gptButton);

            let gpt = document.getElementById("gpt");

            gpt.addEventListener("click", async () => {
                let textarea = document.querySelector('#textarea');
                if(textarea) return;
                BdApi.showToast("Началась генерация ответа...", {type: "info"});
                let answer = await generateAnswer();
                textarea = addTextArea();
                textarea.value = answer;
                textarea.style.height = 'auto';
                textarea.style.height = (textarea.scrollHeight) + 'px';
                BdApi.showToast("Ответ сгенерирован", {type: "success"});
                //document.querySelector('.markup-eYLPri.editor-H2NA06.slateTextArea-27tjG0.fontSize16Padding-XoMpjI').firstChild.firstChild.firstChild.firstChild.innerText = answer;
            })
        }
    }

    start() {
        document.querySelector('.appMount-2yBXZl').addEventListener('keydown', enter)
        token = getToken();
        getUser();
        BdApi.injectCSS("answerGpt", `

        .crossBtn {
            fill: #fff8;
            cursor: pointer;
            margin: 10px;
            width: 24px;
            height: 24px;
            transition: fill 0.2s ease;
        }

        .crossBtn:hover {
            fill: #fff;
        }`);
    } 

    stop() {
        let gpt = document.getElementById("gpt");
        if(gpt) gpt.remove();
        document.querySelector('.appMount-2yBXZl').removeEventListener('keydown', enter)
    }
}