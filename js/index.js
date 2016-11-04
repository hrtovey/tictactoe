var gb,
ga,
a,
GameBoard,
GameActions,
Animation;

GameBoard = {
	settings: {
		gameboard: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
		winningCombos: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
		player: 'X',
		computer: 'O',
		place: {
			0: '#t3square0',
			1: '#t3square1',
			2: '#t3square2',
			3: '#t3square3',
			4: '#t3square4',
			5: '#t3square5',
			6: '#t3square6',
			7: '#t3square7',
			8: '#t3square8'
		},
		announcement: '#announcement',
		playAgain: '#play-again',
		youWin: '#you-win',
		youLose: '#you-lose',
		youTie: '#you-tie',
		playAsO: '#playAsO',
		tokenSwitch: '#label-switch'
	},

	init: function() {
		gb = this.settings;
		this.bindUIActions();
	},

	bindUIActions: function() {
		$(gb.playAgain).click(function() {
			GameBoard.restart();
		});

		$(gb.playAsO).change(function() {
			GameBoard.switchTokens();
		});


	},

	restart: function() {
		gb.gameboard = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
		Animation.gameOver();
		GameBoard.render(gb.gameboard);
		GameActions.chooseFirstPlayer();
		$(gb.youWin).addClass('hidden');
		$(gb.youLose).addClass('hidden');
		$(gb.youTie).addClass('hidden');
		$(gb.playAgain).addClass('hide');

	},

	switchTokens: function() {

		if ($(gb.playAsO).prop("checked")) {
			gb.player = "O";
			gb.computer = "X";
		} else {
			gb.player = "X";
			gb.computer = "O";
		}
		GameBoard.restart();
	},

	render: function() {
		for(var i = 0; i < gb.gameboard.length; i++) {
			if (gb.gameboard[i] !== "E") {
				$(gb.place[i]).removeClass('clickable piece-X piece-O');

				if (gb.gameboard[i] === gb.computer) {
					$(gb.place[i]).addClass('piece-' + gb.computer);
					$(gb.place[i] + "> ." + gb.computer).removeClass('hidden');
				} else if (gb.gameboard[i] === gb.player) {
					$(gb.place[i]).addClass('piece-' + gb.player);
					$(gb.place[i] + "> ." + gb.player).removeClass('hidden');
				}

			} else {
				$(gb.place[i]).addClass('clickable').removeClass('piece-X piece-O');
				$(gb.place[i] + "> .O").addClass('hidden');
				$(gb.place[i] + "> .opener").addClass('hidden');
				$(gb.place[i] + "> .X").addClass('hidden');

			}
		}
	}
};

GameActions = {
	settings: {
		turn: "player"
	},

	init: function() {
		ga = this.settings;
		this.bindUIActions();
		GameActions.chooseFirstPlayer();

	},

	bindUIActions: function() {

	},

	chooseFirstPlayer: function() {
		console.log($(gb.playAsO).prop("checked"));
		if ($(gb.playAsO).prop("checked")) {
			GameActions.computerPlays(gb.gameboard);
		} else {
			GameActions.playerPlays(gb.gameboard);
		}
	},

	computerPlays: function() {
		console.log("playing");
		var spaces = GameActions.findAvailableSpace(gb.gameboard);
		if(spaces.length > 0) {
			var chosenSpace = Math.floor(Math.random() * spaces.length);
			gb.gameboard[spaces[chosenSpace]] = gb.computer;
			GameBoard.render(gb.gameboard);
			if(GameActions.isGameOver() === false) {
				GameActions.playerPlays();
			}
		}
	},

	playerPlays: function() {
		$(document).off().one('click', '.clickable', function handler() {
			gb.gameboard[$(this).attr('id').slice(-1)] = gb.player;
			GameBoard.render(gb.gameboard);
			
			if(GameActions.isGameOver() === false) {
				GameActions.computerPlays();
			}
		});
	},

	isGameOver: function() {
		// checks to see if gameboard has been won and either returns the player who won or false.



		for (var combo = 0; combo < gb.winningCombos.length; combo++) {
			var c = gb.winningCombos[combo];

			if ((gb.gameboard[c[0]] !== 'E') && (gb.gameboard[c[0]] === gb.gameboard[c[1]]) && (gb.gameboard[c[0]] === gb.gameboard[c[2]])) {
				$(gb.playAgain).removeClass('hide');
				if (gb.player === gb.gameboard[c[0]]) {
					$(gb.youWin).removeClass('hidden X-wins O-wins').addClass(gb.player + '-wins');
				} else {
					$(gb.youLose).removeClass('hidden X-wins O-wins').addClass(gb.computer + '-wins');
				}
				Animation.win(c[0], c[2], gb.gameboard[c[0]]);
				return gb.gameboard[c[0]];
			} 
		}

		if (GameActions.findAvailableSpace(gb.gameboard).length === 0) {
			$(gb.youTie).removeClass('hidden');
			$(gb.playAgain).removeClass('hide');
			return "tie";
		}
		
		return false;


	},

	findAvailableSpace: function() {
		// creates a list of available spaces on a gameboard
		var availableSpaces = [];
		for (var space = 0; space < gb.gameboard.length; space++) {
			if (gb.gameboard[space] === 'E') {
				availableSpaces.push(space);
			}
		}

		return availableSpaces;
	}
};

Animation = {
	settings: {
		linemaker: '',
		diagonalLineMaker: ''
	},

	init: function() {
		a = this.settings;
		this.bindUIActions();

		Animation.createLines();
	},

	bindUIActions: function() {
	},

	createLines: function() {
			a.lineMaker = new LineMaker({
				parent: {element: '#t3', position: 'append'},
				position: 'absolute',
				lines: [
					{top: '33%', left: 0, width: '100%', height: 3, color: '#FFFFFF', hidden: true},
					{top: '66%', left: 0, width: '100%', height: 3, color: '#FFFFFF', hidden: true},
					{top: 0, left: '33%', width: 3, height: '100%', color: '#FFFFFF', hidden: true},
					{top: 0, left: '66%', width: 3, height: '100%', color: '#FFFFFF', hidden: true},
					{top: '33%', left: 0, width: '100%', height: 3, color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }},
					{top: '66%', left: 0, width: '100%', height: 3, color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 100, direction: 'RightLeft' }},
					{top: 0, left: '33%', width: 3, height: '100%', color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 200, direction: 'BottomTop' }},
					{top: 0, left: '66%', width: 3, height: '100%', color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 300, direction: 'TopBottom' }},
					// XWin Lines	
					{top: '49%', left: '0', width: '100%', height: 6, color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }},
					{top: '0', left: '49%', width: 6, height: '100%', color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'TopBottom' }},

					{top: 0, left: '16%', width: 6, height: '100%', color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'TopBottom' }},

					{top: 0, left: '82%', width: 6, height: '100%', color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'TopBottom' }},

					{top: '16%', left: 0, width: '100%', height: 6, color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }},

					{top: '82%', left: 0, width: '100%', height: 6, color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }},
					// YWin Lines	
					{top: '49%', left: '0', width: '100%', height: 6, color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }},
					{top: '0', left: '49%', width: 6, height: '100%', color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'TopBottom' }},

					{top: 0, left: '16%', width: 6, height: '100%', color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'TopBottom' }},

					{top: 0, left: '82%', width: 6, height: '100%', color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'TopBottom' }},

					{top: '16%', left: 0, width: '100%', height: 6, color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }},

					{top: '82%', left: 0, width: '100%', height: 6, color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }}
				]
			});

			a.diagonalLineMaker = new LineMaker( {
				parent: {element: '#diagonal', position: 'append'},
				position: 'absolute',
				lines: [
					{top: '48.5%', left: -26, width: '120%', height: 6, color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }},
					{top: -26, left: '48.5%', width: 6, height: '120%', color: '#00B2CF', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'TopBottom' }},
					{top: '48.5%', left: -26, width: '120%', height: 6, color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'LeftRight' }},
					{top: -26, left: '48.5%', width: 6, height: '120%', color: '#E24E49', hidden: true, animation: { duration: 1000, easing: 'easeInOutExpo', delay: 0, direction: 'TopBottom' }}
				]
			});
			
			setTimeout(function() {
				a.lineMaker.animateLineIn(4, {
					complete: function() { a.lineMaker.showLine(0); }
				});
				a.lineMaker.animateLineIn(5, {
					complete: function() { a.lineMaker.showLine(1); }
				});
				a.lineMaker.animateLineIn(6, {
					complete: function() { a.lineMaker.showLine(2); }
				});
				a.lineMaker.animateLineIn(7, {
					complete: function() { a.lineMaker.showLine(3); }
				});
			}, 0);

			setTimeout(function() {
				a.lineMaker.animateLineOut(4);
				a.lineMaker.animateLineOut(5);
				a.lineMaker.animateLineOut(6);
				a.lineMaker.animateLineOut(7);
			}, 2000);

			setTimeout(function() {
				GameBoard.render(gb.gameboard);
			}, 2000);

		},

		win: function(start, stop, winner) {

			if (winner === "O") {
			
				if (start === 0 && stop === 2) {
					a.lineMaker.animateLineIn(12);
				} else if (start ===3 && stop === 5) {
					a.lineMaker.animateLineIn(8);
				} else if (start === 6 && stop === 8) {
					a.lineMaker.animateLineIn(13);
				} else if (start === 0 && stop === 6) {
					a.lineMaker.animateLineIn(10);
				} else if (start === 1 && stop === 7) {
					a.lineMaker.animateLineIn(9);
				} else if (start === 2 && stop === 8) {
					a.lineMaker.animateLineIn(11);
				} else if (start === 0 && stop === 8) {
					a.diagonalLineMaker.animateLineIn(0);
				} else if (start === 2 && stop === 6) {
					a.diagonalLineMaker.animateLineIn(1);
				}
			} else {
			
				if (start === 0 && stop === 2) {
					a.lineMaker.animateLineIn(18);
				} else if (start ===3 && stop === 5) {
					a.lineMaker.animateLineIn(14);
				} else if (start === 6 && stop === 8) {
					a.lineMaker.animateLineIn(19);
				} else if (start === 0 && stop === 6) {
					a.lineMaker.animateLineIn(16);
				} else if (start === 1 && stop === 7) {
					a.lineMaker.animateLineIn(15);
				} else if (start === 2 && stop === 8) {
					a.lineMaker.animateLineIn(17);
				} else if (start === 0 && stop === 8) {
					a.diagonalLineMaker.animateLineIn(2);
				} else if (start === 2 && stop === 6) {
					a.diagonalLineMaker.animateLineIn(3);
				}
			}

		},

		gameOver: function() {
			a.lineMaker.hideLine(8);
			a.lineMaker.hideLine(9);
			a.lineMaker.hideLine(10);
			a.lineMaker.hideLine(11);
			a.lineMaker.hideLine(12);
			a.lineMaker.hideLine(13);
			a.diagonalLineMaker.hideLine(0);
			a.diagonalLineMaker.hideLine(1);

			a.lineMaker.hideLine(14);
			a.lineMaker.hideLine(15);
			a.lineMaker.hideLine(16);
			a.lineMaker.hideLine(17);
			a.lineMaker.hideLine(18);
			a.lineMaker.hideLine(19);
			a.diagonalLineMaker.hideLine(2);
			a.diagonalLineMaker.hideLine(3);
		}

};



$(document).ready(function() {
	GameBoard.init();
	GameActions.init();
	Animation.init();
});

