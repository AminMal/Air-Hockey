var camera, scene, renderer;
var keyState = {};
var map, player1, player2, ball;
var x_map, y_map;
var x_rocket, y_rocket;
var ball_radius;
var ball_speed = 0.1;
var player1_score = 0;
var player2_score = 0;


function setRenderer() {

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}


function setCamera() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 5;
}


function setScene() {

    scene = new THREE.Scene();
}

function setWorld() {
    x_map = 5;
    y_map = 3;
    x_rocket = 0.1;
    y_rocket = 0.5;

    /* Add kardane map */
    var geometry = new THREE.BoxGeometry(x_map, y_map, 0.01);
    var material = new THREE.MeshPhongMaterial({color: 0x7CC7FF, side: THREE.DoubleSide});
    map = new THREE.Mesh(geometry, material);
    scene.add(map);


    /* Add kardane  player 1 */
    var geometry = new THREE.BoxGeometry(x_rocket, y_rocket, 0.1);
    var material = new THREE.MeshPhongMaterial({color: 0x005000});
    player_1 = new THREE.Mesh(geometry, material);
    player_1.position.x = -x_map / 2;
    scene.add(player_1);

    /* Add kardane player 2 */
    var geometry = new THREE.BoxGeometry(x_rocket, y_rocket, 0.1);
    var material = new THREE.MeshPhongMaterial({color: 0xff0000});
    player_2 = new THREE.Mesh(geometry, material);
    player_2.position.x = x_map / 2;
    scene.add(player_2);


    /* Add kardane ball */
    ball_radius = 0.1;
    var geometry = new THREE.SphereGeometry(ball_radius, 32, 32);
    var material = new THREE.MeshPhongMaterial({color: 0xFF8C00});
    ball = new THREE.Mesh(geometry, material);
    ball.position.z += 0.1;
    scene.add(ball);


}


var hold = 0;

function respawn_on_player1(recover_speed) {
    ball.position.copy(player_1.position);
    console.log(recover_speed)
    ball_speed = -recover_speed;
    hold = 0;
}

function respawn_on_player2(recover_speed) {
    ball.position.copy(player_2.position);
    console.log(recover_speed)
    console.log(player_1.position)
    console.log(player_2.position)
    console.log(ball.position)
    ball_speed = -recover_speed;
    hold = 0;
}

function get_random_angle(minimum, maximum) {

    var randomnumber = Math.random() * ( maximum - minimum ) + minimum;

    return randomnumber;
}

var ball_angle = Math.PI;
var player2_speed = 0.05;

function animate() {

    requestAnimationFrame(animate);

    ball.position.x += ball_speed * Math.cos(ball_angle);
    ball.position.y += ball_speed * Math.sin(ball_angle);


    /* check player_1 collision */
    if (( ball.position.x < player_1.position.x + (x_rocket / 2) ) &&
        ( ball.position.y < ( player_1.position.y + y_rocket / 2  ) ) &&
        ( ball.position.y > ( player_1.position.y - y_rocket / 2  ) )) {

        if (hold == 0) {
            ball.position.x = player_1.position.x + (x_rocket / 2);
            ball_speed = -ball_speed;
            ball_angle = get_random_angle(-Math.PI / 4, Math.PI / 4);
        }
    }

    /* check player_2 collision */
    if (( ball.position.x > player_2.position.x - (x_rocket / 2) ) &&
        ( ball.position.y < ( player_2.position.y + y_rocket / 2  ) ) &&
        ( ball.position.y > ( player_2.position.y - y_rocket / 2  ) )) {

        if (hold == 0) {
            ball.position.x = player_2.position.x - (x_rocket / 2);
            ball_speed = -ball_speed;
            ball_angle = get_random_angle(-Math.PI / 4, Math.PI / 4);
        }
    }

    /* collision ba labeye bala */
    if (ball.position.y >= (y_map / 2)) {
        ball_angle = -ball_angle;
    }

    /* collision ba labeye paein */
    if (ball.position.y <= -(y_map / 2)) {
        ball_angle = -ball_angle;
    }


    /* Goal on player_1 side */
    if (ball.position.x < -x_map / 2 - 2 * ball_radius) {

        if (hold == 0) {
            player2_score += 1;
            document.getElementById("player2_score").innerHTML = player2_score;
            setTimeout(respawn_on_player1, 1000, ball_speed);
            hold = 1;
        }

        ball_speed = 0;
    }


    /* Goal on player_2 side */
    if (ball.position.x > x_map / 2 + 2 * ball_radius) {

        if (hold == 0) {
            player1_score += 1;
            document.getElementById("player1_score").innerHTML = player1_score;
            setTimeout(respawn_on_player2, 1000, ball_speed);
            hold = 1;
        }

        ball_speed = 0;
    }


    renderer.render(scene, camera);
}


function setEventListenerHandler() {
    window.addEventListener('keydown', function (e) {
        keyState[e.keyCode || e.which] = true;
    }, true);

    window.addEventListener('keyup', function (e) {
        keyState[e.keyCode || e.which] = false;
    }, true);

    window.addEventListener('resize', onWindowResize, false);
}


function setKeyboardControls() {

    if (keyState[87]) {

        if (player_1.position.y < ( (y_map / 2) - ( y_rocket / 2 ))) {
            player_1.position.y += 0.075;
        }
    }

    if (keyState[83]) {

        if (player_1.position.y > ( -(y_map / 2) + ( y_rocket / 2 ))) {
            player_1.position.y -= 0.075;
        }
    }
    if (keyState[38]) {

        if (player_2.position.y < ( (y_map / 2) - ( y_rocket / 2 ))) {
            player_2.position.y += 0.075;
        }
    }
    if (keyState[40]) {

        if (player_2.position.y > ( -(y_map / 2) + ( y_rocket / 2 ))) {
            player_2.position.y -= 0.075;
        }
    }

    setTimeout(setKeyboardControls, 10);
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function setLights() {

    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);


    var spotLight = new THREE.SpotLight(0x7CC7FF);
    spotLight.position.set(0, 0, 2);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = window.innerWidth;
    spotLight.shadow.mapSize.height = window.innerHeight;

    scene.add(spotLight);
}

function average() {
    player1_score = 0;
    player2_score = 0;
    document.getElementById("player1_score").innerHTML = player1_score;
    document.getElementById("player2_score").innerHTML = player2_score;

    if (hold == 0) {
        ball.position.x = 0;
        ball.position.y = 0;
        ball_speed = -0.05;
        ball_angle = Math.PI;
    }
}

function expert() {
    player1_score = 0;
    player2_score = 0;
    document.getElementById("player1_score").innerHTML = player1_score;
    document.getElementById("player2_score").innerHTML = player2_score;

    if (hold == 0) {
        ball.position.x = 0;
        ball.position.y = 0;
        ball_speed = -0.15;
        ball_angle = Math.PI;
    }
}

function main() {

    setRenderer();
    setCamera();
    setEventListenerHandler();
    setKeyboardControls();
    setScene();
    setLights();
    setWorld();
    animate();
}
