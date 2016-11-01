var gb,
ga,
GameBoard,
GameActions;

GameBoard = {
	settings: {
		gameboard: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'],
		winningCombos: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
		player: 'Y',
		computer: 'X',
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
		announcement: '#announcement'
	},

	init: function() {
		gb = this.settings;
		this.bindUIActions();
		GameBoard.render(gb.gameboard);
	},

	bindUIActions: function() {
	},

	render: function() {
		for(var i = 0; i < gb.gameboard.length; i++) {
			if (gb.gameboard[i] !== "E") {
				$(gb.place[i]).removeClass('clickable player computer').text(gb.gameboard[i]);

				if (gb.gameboard[i] === gb.computer) {
					$(gb.place[i]).addClass('computer');
				} else if (gb.gameboard[i] === gb.player) {
					$(gb.place[i]).addClass('player');
				}

			} else {
				$(gb.place[i]).addClass('clickable').removeClass('player computer');
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
		GameActions.playerPlays(gb.gameboard);

	},

	bindUIActions: function() {

	},

	computerPlays: function() {
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

		$(document).on('click', '.clickable', function handler() {
			gb.gameboard[$(this).attr('id').slice(-1)] = gb.player;
			$(document).off('click', '.clickable', handler);
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
				$('#announcement-container').removeClass('hide');
				$(gb.announcement).text(gb.gameboard[c[0]] + " wins!");
				return gb.gameboard[c[0]];
			} 
		}

		if (GameActions.findAvailableSpace(gb.gameboard).length === 0) {
			$('#announcement-container').removeClass('hide');
			$(gb.announcement).text("It's a tie!");
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



$(document).ready(function() {
	GameBoard.init();
	GameActions.init();
});

