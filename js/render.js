export default class Render {

  renderUI() {
    //This creates all divs and buttons needed for the ui
    // Doesn't work dynamically though
    //container div
    let container_div = document.createElement("div");
    container_div.setAttribute("class", "container");
    document.body.appendChild(container_div);

    let container = document.getElementsByClassName("container")[0];

    //-----------------------Left side of ui---------------------------//

    //left div
    let left_div = document.createElement("div");
    left_div.setAttribute("class", "left");
    container.appendChild(left_div);

    let left = document.getElementsByClassName("left")[0];

    //board div
    let board_div = document.createElement("div");
    board_div.setAttribute("class", "board");
    left.appendChild(board_div);

    //temporary board image
    var board_image = document.createElement("img");
    board_image.src = 'board.png';
    board_div.appendChild(board_image);

    //ui_container div
    let ui_container_div = document.createElement("div");
    ui_container_div.setAttribute("class", "ui_container");
    left.appendChild(ui_container_div);

    let ui_container = document.getElementsByClassName("ui_container")[0];


    //-------------------Ui button divs----------------------
    //ui_left div
    let ui_left_div = document.createElement("div");
    ui_left_div.setAttribute("id", "ui_left");
    ui_container.appendChild(ui_left_div);

    //ui_stand div
    let ui_stand_div = document.createElement("div");
    ui_stand_div.setAttribute("id", "ui_stand");
    ui_container.appendChild(ui_stand_div);

    //temporary stand image
    var image = document.createElement("img");
    image.src = 'stand.png';
    document.getElementById("ui_stand").appendChild(image);

    //ui_right div
    let ui_right_div = document.createElement("div");
    ui_right_div.setAttribute("id", "ui_right");
    ui_container.appendChild(ui_right_div);

    //get the ui div's
    let ui_left = document.getElementById("ui_left");
    let ui_stand = document.getElementById("ui_stand");
    let ui_right = document.getElementById("ui_right");


    //-------------------Action buttons----------------------
    // Ångra button
    let angra = document.createElement("button");
    angra.setAttribute("class", "btn");
    angra.setAttribute("id", "undoButton");
    angra.textContent = "Ångra";
    ui_left.appendChild(angra);

    // Passa button
    let passa = document.createElement("button");
    passa.setAttribute("class", "btn pass");
    passa.setAttribute("id", "passaButton");
    passa.textContent = "Passa";
    ui_left.appendChild(passa);

    //Spela button
    let spela = document.createElement("button");
    spela.setAttribute("class", "btn play");
    spela.setAttribute("id", "submitButton");
    spela.textContent = "Spela";
    ui_right.appendChild(spela);

    // Byt button
    let byta = document.createElement("button");
    byta.setAttribute("class", "btn skip");
    byta.setAttribute("id", "changeTilesButton");
    byta.textContent = "Byta";
    ui_right.appendChild(byta);



    //-----------------------Right side of gui---------------------------//

    //right div
    let right_div = document.createElement("div");
    right_div.setAttribute("class", "right");
    container.appendChild(right_div);

    let right = document.getElementsByClassName("right")[0];

    //-------------------Scoreboard----------------------
    //scoreboard div
    let score_div = document.createElement("div");
    score_div.setAttribute("class", "scoreboard");
    right.appendChild(score_div);

    let scoreboard = document.getElementsByClassName("scoreboard")[0];

    //score_header
    let score_header = document.createElement("div");
    score_header.setAttribute("id", "score_header");
    scoreboard.appendChild(score_header);
    let sc1 = document.createTextNode("Spelare");
    document.getElementById("score_header").appendChild(sc1);

    //score_players
    let score_players = document.createElement("div");
    score_players.setAttribute("id", "score_players");
    scoreboard.appendChild(score_players);
    let sc2 = document.createTextNode("1.Ewa-Gun ");
    document.getElementById("score_players").appendChild(sc2);

    //score_score
    let score_score = document.createElement("div");
    score_score.setAttribute("id", "score_score");
    scoreboard.appendChild(score_score);
    let sc3 = document.createTextNode("140");
    document.getElementById("score_score").appendChild(sc3);

    //score_tilesleft
    let score_tilesleft = document.createElement("div");
    score_tilesleft.setAttribute("id", "score_tilesleft");
    scoreboard.appendChild(score_tilesleft);
    //let sc4 = document.createTextNode(this.bag.tiles.length + "brickor kvar");
    let sc4 = document.createTextNode("66 brickor kvar");
    document.getElementById("score_tilesleft").appendChild(sc4);


    //-------------------Possible points----------------------
    //points div
    let points_div = document.createElement("div");
    points_div.setAttribute("class", "points");
    right.appendChild(points_div);

    let points = document.getElementsByClassName("points")[0];

    //points_header
    let points_header = document.createElement("div");
    points_header.setAttribute("id", "points_header");
    points.appendChild(points_header);
    let pt1 = document.createTextNode("Möjliga poäng");
    document.getElementById("points_header").appendChild(pt1);

    //points_possible
    let points_possible = document.createElement("div");
    points_possible.setAttribute("id", "points_possible");
    points.appendChild(points_possible);
    let pt2 = document.createTextNode("20");
    document.getElementById("points_possible").appendChild(pt2);

    //-------------------------Chat---------------------------
    //Chat div
    let chat_div = document.createElement("div");
    chat_div.setAttribute("class", "chat");
    right.appendChild(chat_div);

    let chat = document.getElementsByClassName("chat")[0];

    //Chat header
    let chat_header = document.createElement("div");
    chat_header.setAttribute("id", "chat_header");
    chat.appendChild(chat_header);
    let ch1 = document.createTextNode("Chat");
    document.getElementById("chat_header").appendChild(ch1);

    //Chat window
    let chat_window = document.createElement("div");
    chat_window.setAttribute("id", "chat_window");
    chat.appendChild(chat_window);
    let ch2 = document.createTextNode("Jörgen spelade och fick 40 poäng");
    document.getElementById("chat_window").appendChild(ch2);

    //Chat typebox
    let chat_type = document.createElement("div");
    chat_type.setAttribute("id", "chat_type");
    chat.appendChild(chat_type);
    let ch3 = document.createTextNode("Skriv här..");
    document.getElementById("chat_type").appendChild(ch3);
  }
}