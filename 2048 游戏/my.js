var NUM = 16;

function Game2048(container) {
	this.container = container;
	this.blocks = new Array(NUM);
	this.len = this.blocks.length;
	this.score = 0;

}
Game2048.prototype = {
	init: function() {
		for (var i = 0; i < this.len; i++) {
			var block = this.newBlock(0);
			block.setAttribute('index', i);
			this.container.appendChild(block);
			this.blocks[i] = block;
		}
		this.randomBlock();
		this.randomBlock();
	},
	newBlock: function(val) {
		var block = document.createElement('div');
		this.setBlockVal(block, val)
		return block;
	},
	setBlockVal: function(block, val) {
		block.setAttribute('class', 'block block' + val);
		block.setAttribute('val', val);
		block.innerHTML = val > 0 ? val : '';
	},
	randomBlock: function() {
		var zeroBlocks = [];
		for (var i = 0; i < this.len; i++) {
			if (this.blocks[i].getAttribute('val') == 0) {
				zeroBlocks.push(this.blocks[i]);
			}
		}
		var rBlock = zeroBlocks[Math.floor(Math.random() * zeroBlocks.length)];
		this.setBlockVal(rBlock, Math.random() < 0.6 ? 2 : 4);
	},
	move: function(direction) {
		var j;
		switch (direction) {
			case 38:
			// 向上|从第二行开始，与它上面的块的值合并
				for (var i = 4; i < this.len; i++) {
					j = i;
					while (j >= 4) {
						this.merge(this.blocks[j - 4], this.blocks[j]);
						j -= 4;
					}
				}
				break;
			case 40:
			// 向下|从倒数第二个元素开始，与它下面的元素的值合并
				for (var i = 11; i >= 0; i--) {
					j = i;
					while (j <= 11) {
						this.merge(this.blocks[j + 4], this.blocks[j]);
						j += 4;
					}
				}
				break;
			case 37:
			// 向左|第二列第一个元素开始，与它左边的元素合并
				for (var i = 1; i < this.len; i++) {
					j = i;
					while (j % 4 != 0) {
						this.merge(this.blocks[j - 1], this.blocks[j]);
						j -= 1;
					}
				}
				break;
			case 39:
			// 向右|倒数第二列最后一个元素开始，与它右边的元素合并
				for (var i = 14; i >= 0; i--) {
					j = i;
					while (j % 4 != 3) {
						this.merge(this.blocks[j + 1], this.blocks[j]);
						j += 1;
					}
				}
				break;
		}
		this.randomBlock();
	},
	merge: function(prevBlock, currentBlock) {
		var prevVal = prevBlock.getAttribute('val');
		var currentVal = currentBlock.getAttribute('val');
		if (currentVal != 0) {
			if (prevVal == 0) {
				this.setBlockVal(prevBlock, currentVal);
				this.score += 0;
				this.setBlockVal(currentBlock, 0);
			} else if (prevVal == currentVal) {
				this.setBlockVal(prevBlock, prevVal * 2);
				this.setBlockVal(currentBlock, 0);
				this.score += prevVal*2;
				console.log(prevVal*2);
				console.log('----------------');
			}
		}
		var score = document.getElementById('score');
		document.getElementById("score").innerHTML=this.score;
	},
	equal: function(block1, block2) {
		return block1.getAttribute('val') == block2.getAttribute('val');
	},
	success: function() {
		for (var i = 0; i < this.len; i++) {
			if (this.blocks[i].getAttribute('val') == 2048) {
				return true;
			}
		}
	},
	gameisover: function() {
		for (var i = 0; i < this.len; i++) {
			// 存在空块
			if (this.blocks[i].getAttribute('val') == 0) {
				return false;
			}
			// 存在左右相等
			if (i % 4 != 3) {
				if (this.equal(this.blocks[i], this.blocks[i + 1])) {
					return false;
				}
			}
			// 存在上下相等
			if (i < 12) {
				if (this.equal(this.blocks[i], this.blocks[i + 4])) {
					return false;
				}
			}
		}
		return true;
	},
	clean: function() {
		for (var i = 0; i < this.len; i++) {
			this.container.removeChild(this.blocks[i]);
		}
		this.blocks = new Array(NUM);
	}
}

var container;
var start;
window.onload = function() {
	container = document.getElementById('container');
	start = document.getElementById('start');
	start.addEventListener('click', function(e) {
		e.target.style.display = 'none';
		game = new Game2048(container);
		game.init();
	});
}

window.onkeydown = function(e) {
	var keynum, keychar;
	// e.which指示哪个键被按下，给出该键的索引值（按键码）。
	if (window.event) { // IE
		keynum = e.keyCode;
	} else if (e.which) { // Netscape/Firefox/Opera
		keynum = e.which;
	}
	// console.log(keynum);
	try{
		if(game.success()) {
			game.clean();
			start.style.display = 'block';
			start.innerHTML = 'you win!! play again?';
			return;
		}
	}catch(e){
		console.log('click first!');
	}
	if ([37, 38, 39, 40].indexOf(keynum) > -1) {
		try{
			if (game.gameisover()) {
				game.clean();
				start.style.display = 'block';
				start.innerHTML = 'game over, play again?';
				return;
			}
			game.move(keynum);
		}catch(err){
			console.log('something wrong!');
		}
	}
}
