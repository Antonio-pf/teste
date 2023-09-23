
//cria uma imgem dentro da memoria e associa uma urla

const som = new Audio();
som.src = './efeitos/hit.wav';
const sprites = new Image();
sprites.src = './sprites.png';

let frames = 0;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// menu

//telas
const globais = {};

let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const telas = {
    INICIO: {

        inicializa() {
            globais.flappyBird = criaFlappyBird()
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();

            menu.desenha();
        },

        click() {
            mudaParaTela(telas.JOGO);

        },
        atualiza() {
            globais.chao.atualiza();
           
        }

    }
}

telas.JOGO = {
    desenha() {
        planoDeFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click() {
        globais.flappyBird.pula();

    },
    atualiza() {
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
    }
}
const menu = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            menu.spriteX, menu.spriteY,
            menu.largura, menu.altura,
            menu.x, menu.y,
            menu.largura, menu.altura,

        );

    },
};

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },

        espaco: 80,

        desenha() {

            // para cada par, desenha
            canos.pares.forEach(function (par) {
                const ramdomY = par.y;
                const espacoEntreCanos = 90;

                const canoAteCeuX = par.x;
                const canoAteCeuY = ramdomY;

                // cano do ceu
                contexto.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoAteCeuX, canoAteCeuY,
                    canos.largura, canos.altura,
                )
                //cano do chao

                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacoEntreCanos + ramdomY;
                contexto.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )

                par.canoCeu = {
                    x: canoAteCeuX,
                    y: canos.altura + canoChaoY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoAteCeuY
                }

            })

        },
        temColisaoComFlappy(par) {

            const cabecaFlaapy = globais.flappyBird.y;
            const peFlaapy = globais.flappyBird.y + globais.flappyBird.altura;

            if ((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
                //verifca se bateu a cabeca
            
                if (cabecaFlaapy <= par.canoCeu.y) {
                    
                    return true;
                }

                //verifica se batue o pe
                if (peFlaapy <= par.canoChao.y) {
                    console.log(2)
                    return true;
                }
            }

            return false;
        },

        pares: [],

        atualiza() {
            const passouDe100Frames = frames % 100 === 0;

            if (passouDe100Frames) {

                canos.pares.push({
                    x: canvas.width,
                    y: -150 *(Math.random() + 1)

                });
            }

            canos.pares.forEach(function (par) {
                par.x = par.x - 2;

                if (canos.temColisaoComFlappy(par)) {
                    console.log("Perdeu")
                    //mudaParaTela(telas.INICIO)
                    
                }

                //retira canos para não consumir memória
                if (par.x + canos.largura <= 0) {
                    canos.pares.shift();
                }
            });

        }
    }
    return canos;
}

//chao
function criaChao() {

    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,

        atualiza() {
            const movChao = 1;
            const repete = chao.largura / 2;
            const movimentacao = chao.x - movChao;

            chao.x = movimentacao % repete;

        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,

            );

            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,

            );
        },
    };
    return chao;
}


function fazColisao(flappyBird, chao) {

    const flappyBirdY = flappyBird.y + flappyBird.altura - 50;

    const chaoY = chao.y - 25;
   

    if (flappyBird.y >= chaoY) {
        return true;
    }
    return false;

}

// personagem
function criaFlappyBird() {

    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,

        atualiza() {

            if (fazColisao(flappyBird, globais.chao)) {

                som.play();

                setTimeout(() => {
                    mudaParaTela(telas.INICIO)

                }, 500);
                return;

            }
            flappyBird.velocidade = flappyBird.velocidade + this.gravidade
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
        ],

        frameAtual: 0,

        atualizaOFrame() {
            const intervaloDeFrames = 10;
            const passouDoIntervalo = frames % intervaloDeFrames === 0;
            if (passouDoIntervalo) {
                // deixa a batida de asas mais pausada

                const inicio = 1;
                const incremento = inicio + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;

            }

        },
        desenha() {
            flappyBird.atualizaOFrame()
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,

            );

        },
    };

    return flappyBird;

}


// plano de fundo

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce'
        contexto.fillRect(0, 0, canvas.width, canvas.height)
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,

        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,

        );

    },
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames++;

    requestAnimationFrame(loop);

}

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
});

mudaParaTela(telas.INICIO)
loop();
