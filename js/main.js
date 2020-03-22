(function(){
	self.Board = function (width,height) {
		this.width=width;
		this.height=height;
		this.playing=false;
		this.gameOver=false;
		this.bars=[];
		this.ball=null;
		this.playing=false;
	}

	self.Board.prototype= {
		get elements(){
			var elements=this.bars.map(function (bar) {
				return bar; 
			});
			elements.push(this.ball);
			return elements;
		}
	};
})();

(function () {
	self.Bar = function(x,y,width,height,board){
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height;
		this.board=board;
		this.board.bars.push(this);
		this.kind="rectangle";
		this.speed=10;
	}

	self.Bar.prototype={
		down:function(){
			this.y += this.speed;

		},
		up: function(){
			this.y -= this.speed;
		},
		toString: function () {
			return "x: "+this.x+"y: "+this.y; 
		}
	}

})();
(function() {
	self.Ball = function (x,y,radius,board) {
		this.x=x;
		this.y=y;
		this.radius=radius;
		this.speedY=0.1;
		this.speedX=2;
		this.board=board;
		board.ball=this;
		this.kind="circle";
		this.direction=1;
		this.bounce_angle = 0;
		this.max_bounce_angle=Math.PI / 12;
		this.speed = 3;
	}
	self.Ball.prototype = {
		move: function(){
			this.x += (this.speedX * this.direction );
			this.y += (this.speedY);
		},
		get width(){
			return this.radius*2;
		},
		get height(){
			return this.radius*2;
		},
		collision: function (bar) {
			//Reacciona a la colisiona con una barra que recibe como parametro  
		    var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;

		    var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

		    this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

		    this.speed_y = this.speed * -Math.sin(this.bounce_angle);
		    this.speed_x = this.speed * Math.cos(this.bounce_angle);

		    if (this.x > (this.board.width / 2)) this.direction = -1;
		    else this.direction = 1;
		}
	 }
})();
(function () {
	self.BoardView = function(canvas,board){
		this.canvas = canvas;		
		this.board= board;
		this.canvas.height=board.height;
		this.canvas.width=board.width;
		
		
		this.ctx= canvas.getContext("2d");
	}


	self.BoardView.prototype= {
		clean: function () {
			this.ctx.clearRect(0,0,this.board.width,this.board.height);
		},
		draw : function () {
			for (var i = this.board.elements.length - 1; i >= 0; i--) {
				var el = this.board.elements[i];

				draw(this.ctx,el);
			};
		},
		checkCollisions: function () {
			for (var i = this.board.bars.length - 1; i >= 0; i--) {
				var bar=this.board.bars[i]
				if (hit(bar,this.board.ball)) {
					this.board.ball.collision(bar);

				}
			};
		},
		play: function (ctx,element) {
			if (this.board.playing) {
				this.clean();
				this.draw();
				this.checkCollisions();
				this.board.ball.move(); 
			}
			
		}

	}
	function hit(a,b) {
		var hit=false;

		if (b.x+b.width >= a.x && b.x<a.x+a.width) {
			if (b.y+b.height >=a.y && b.y <a.y + a.height) {hit=true;}
		}
		if (b.x<=a.x && b.x + b.width >=a.x + a.width) {
			if (b.y<=a.y && b.y +b.height >=a.y + a.height) {hit=true;}
		}
		if (a.x <=b.x && a.x + a.width >=b.x + b.width) {
			if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
				hit = true;
			}
		}
		return hit;  
	}

	function draw(ctx,element){
		//if (element !==null && element.hasOwnProperty("kind")) {
		switch(element.kind){
			case "rectangle":
				ctx.fillRect(element.x,element.y,element.width,element.height);
				break;

			case "circle":
				console.log("aqui ta bien");
				ctx.beginPath();
				ctx.arc(element.x,element.y,element.radius,0,7);
				ctx.fill();
				ctx.closePath();
				
				break;
				
		}
	}
})();

var board = new Board(700,500);
var bar = new Bar(20,100,40,100,board)
var bar_2 = new Bar(620,100,40,100,board)
var canvas = document.getElementById('canvas');
var boView=new BoardView(canvas,board);
var ball = new Ball(100,100,10,board);

boView.draw();
window.requestAnimationFrame(controller); 

document.addEventListener("keydown",function(ev) {
	
	if(ev.keyCode ==38){
		ev.preventDefault();
		bar.up();
	}else if (ev.keyCode == 40){
		ev.preventDefault();
		bar.down();
	}else if (ev.keyCode ==87){	//w	
		ev.preventDefault();
		bar_2.up();
	}else if(ev.keyCode==83){	//s
		ev.preventDefault();
		bar_2.down();
	}else if(ev.keyCode===32){
		ev.preventDefault();
		board.playing=!board.playing;
	}
	
});
self.addEventListener("Load",controller());

function controller(){
 
	boView.play();
	window.requestAnimationFrame(controller);
}
