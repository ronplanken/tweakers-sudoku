// ==UserScript==
// @namespace     http://127.0.0.1/
// @name          Tweakers Sudoku Helper
// @description   Solves Sudoku on tweakers.net
// @include       https://tweakers.net/*
// @version       1.0
// @GM_version    0.6.4
// ==/UserScript==

function get_at(x,y) {
    return document.getElementsByName("sudoku[" + ((x * 9) + y).toString() + "]")[0];
}

function obvious() {
	var state=new Array();
	var i,j,x,y,x2,y2,x0,y0;
	var num,done=0;
	for(y=0;y<9;y++) {
		for(x=0;x<9;x++) {
			var sq=get_at(x,y);
			if(sq.value!='')
				state[y*9+x]=sq.value;
			else
				state[y*9+x]=0;
		}
	}
	while(!done) {
		done=1;
		var poss=new Array();
		for(i=0;i<81*9;i++) poss[i]=1;
		for(y=0;y<9;y++) {
			for(x=0;x<9;x++) {
				num=state[y*9+x];
				if(num) {
					num--;
					// rows
					for(x2=0;x2<9;x2++)
						poss[y*81+x2*9+num]=0;
					// cols
					for(y2=0;y2<9;y2++)
						poss[y2*81+x*9+num]=0;
					// square
					x0=Math.floor(x/3)*3;
					y0=Math.floor(y/3)*3;
					for(y2=y0;y2<y0+3;y2++)
						for(x2=x0;x2<x0+3;x2++)
							poss[y2*81+x2*9+num]=0;
					// self
					for(i=0;i<9;i++)
						poss[y*81+x*9+i]=0;
				}
			}
		}
		// only one poss?
		for(y=0;y<9;y++) {
			for(x=0;x<9;x++) {
				if(!state[y*9+x]) {
					j=0;
					for(i=0;i<9;i++)
						if(poss[y*81+x*9+i]) {
							num=i+1;
                            j++;
                        }
					if(j==1) {
						state[y*9+x]=num;
						get_at(x,y).value=num;
						done=0;
					}
				}
			}
		}
		// elimination (most powerful)
		for(j=1;j<10;j++) {
			for(y=0;y<9;y++)
				for(x=0;x<9;x++)
					poss[y*9+x]=(0==state[y*9+x]);
			for(y=0;y<9;y++) {
				for(x=0;x<9;x++) {
					// learn nothing from blanks
					if(!(num=state[9*y+x]))
						continue;
					if(num!=j) continue;
					// rows
					for(x2=0;x2<9;x2++)
						poss[9*y+x2]=0;
					// cols
					for(y2=0;y2<9;y2++)
						poss[9*y2+x]=0;
					// squares
					x0=Math.floor(x/3)*3;
					y0=Math.floor(y/3)*3;
					for(y2=y0;y2<y0+3;y2++)
						for(x2=x0;x2<x0+3;x2++)
							poss[y2*9+x2]=0;
				}
			}
			for(y0=0;y0<9;y0+=3) {
				for(x0=0;x0<9;x0+=3) {
					i=0;
					for(y2=y0;y2<y0+3;y2++) {
						for(x2=x0;x2<x0+3;x2++) {
							if(poss[y2*9+x2]) {
								x=x2;
								y=y2;
								i++;
							}
						}
					}
					if(1==i) {
						state[y*9+x]=j;
						get_at(x,y).value=j;
						done=0;
					}
				}
			}
		}
	}
}

function addCheatButton() {
	var p=document.getElementById("container");
	if(p) {
        var btn = document.createElement("button");
        btn.className = "sudokuButton fancyButton";
        btn.id = "cheat";
        btn.appendChild(document.createTextNode("Cheaten"));
        p.appendChild(btn);

		document.getElementById('cheat').addEventListener('click',obvious,true);
	}
}

addCheatButton();