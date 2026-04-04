const atyniaCalendar = {
	startingYear: 1,
	months: ["Protanox", "Deftanox", "Tritanox", "Tertanox", "Prokalok", "Defkalok", "Trikalok", "Terkalok", "Prothin", "Defthin", "Trithin", "Terthin", "Prochem", "Defchem", "Trichem", "Terchem"],
	monthOffset: 4,
	monthLength: 25,
	weekdays: ["Othirhal", "Malehal", "Lukahal", "Bahrohal", "Laevohal", "Suyasarhal", "Saldrehal", "Kralorhal"],
	dayOffset: 0
};

const standardCalendar = {
	startingYear: 1,
	months: ["Vigiluna", "Fortiluna", "Vinceluna", "Regaluna", "Cantaluna", "Condiluna", "Artiluna", "Fatiluna", "Nautaluna", "Veneluna"],
	monthOffset: 0,
	monthLength: 40,
	weekdays: ["Kralorde", "Athyde", "Holade", "Sokkode", "Melde", "Xolade", "Darkade", "Velde", "Zovande", "Dominde"],
	dayOffset: 0
};

const smardaTxt = new Image();
smardaTxt.src = "smarda-texture.png";

const tyrathaTxt = new Image();
tyrathaTxt.src = "tyratha-texture.png";

const prothaTxt = new Image();
prothaTxt.src = "protha-texture.png";

const adezoTxt = new Image();
adezoTxt.src = "adezo-texture.png";

adezoTxt.addEventListener('load', function() { calculateMoons(); }, false);

const moons = {
	smarda: {orbit: 25, offset: 12.5, celestial: "Eovena", draconic: "Ainissa", atyniaDraconic: "Smarda", color: '#548235', direction: '1', workingName: "", texture: smardaTxt, painter: false, initial:'s'},
	protha: {orbit: 40, offset: 20, celestial: "Arsomna", draconic: "Protha", color: '#A5A5A5', direction: '1', workingName: "", texture: prothaTxt, painter: false, initial:'p'},
	tyratha: {orbit: 80, offset: 40, celestial: "Gilvida", draconic: "Tyratha", color: '#C00000', direction: '1', workingName: "", texture: tyrathaTxt, painter: false, initial:'t'},
	adezo: {orbit: 401, offset: 200.5, celestial: "Halmenda", draconic: "Adezo", color: '#a341aa', direction: '1', workingName: "", texture: adezoTxt, painter: false, initial:'a'}
};



//initialize moon name labels
if ($('#nameset').val() == "draconic") {
	moons.smarda.workingName = $('#calendar').val() == "atynia" ? moons.smarda.atyniaDraconic : moons.smarda.draconic;
	moons.protha.workingName = moons.protha.draconic;
	moons.tyratha.workingName = moons.tyratha.draconic;
	moons.adezo.workingName = moons.adezo.draconic;
} else { //value = "celestial"
	moons.smarda.workingName = moons.smarda.celestial;
	moons.protha.workingName = moons.protha.celestial;
	moons.tyratha.workingName = moons.tyratha.celestial;
	moons.adezo.workingName = moons.adezo.celestial;
}
$('#smardaName').text(moons.smarda.workingName);
$('#prothaName').text(moons.protha.workingName);
$('#tyrathaName').text(moons.tyratha.workingName);
$('#adezoName').text(moons.adezo.workingName);

$('#nameset').change(function() {
	if ($('#nameset').val() == "draconic") {
		moons.smarda.workingName = $('#calendar').val() == "atynia" ? moons.smarda.atyniaDraconic : moons.smarda.draconic;
		moons.protha.workingName = moons.protha.draconic;
		moons.tyratha.workingName = moons.tyratha.draconic;
		moons.adezo.workingName = moons.adezo.draconic;
	} else { //value = "celestial"
		moons.smarda.workingName = moons.smarda.celestial;
		moons.protha.workingName = moons.protha.celestial;
		moons.tyratha.workingName = moons.tyratha.celestial;
		moons.adezo.workingName = moons.adezo.celestial;
	}
	$('#smardaName').text(moons.smarda.workingName);
	$('#prothaName').text(moons.protha.workingName);
	$('#tyrathaName').text(moons.tyratha.workingName);
	$('#adezoName').text(moons.adezo.workingName);
	calculateMoons();
})

//set working calendar
let workingCalendar = $('#calendar').val() == "atynia" ? atyniaCalendar : standardCalendar;
let numMonths = workingCalendar.months.length;
for (let i = 0; i < numMonths; i++) {
	$('#month').append(new Option(workingCalendar.months[i], (i+1+workingCalendar.monthOffset) % numMonths));
}
for (let i = 0; i < workingCalendar.monthLength; i++) {
	$('#day').append(new Option(i+1, i+1));
}
$('#calendar').change(function () {
	let t = calcT(Number($('#month').val()), Number($('#day').val()), Number($('#year').val()));
	console.log("current", t);
	
	workingCalendar = $('#calendar').val() == "atynia" ? atyniaCalendar : standardCalendar;
	$('#month').empty();
	let numMonths = workingCalendar.months.length;
	for (let i = 0; i < numMonths; i++) {
		$('#month').append(new Option(workingCalendar.months[i], (i+1+workingCalendar.monthOffset) % numMonths));
	}
	$('#day').empty();
	for (let i = 0; i < workingCalendar.monthLength; i++) {
		$('#day').append(new Option(i+1, i+1));
	}
	
	if ($('#nameset').val() == "draconic") {
		moons.smarda.workingName = $('#calendar').val() == "atynia" ? moons.smarda.atyniaDraconic : moons.smarda.draconic;
	} else { //value = "celestial"
		moons.smarda.workingName = moons.smarda.celestial;
	}
	$('#smardaName').text(moons.smarda.workingName);
	console.log("same?", t);
	setDateFromT(t);
	console.log("set", t);
	calcWeekday(t);
	console.log("hello", t);
});
	

// MoonPainter code modified from https://codepen.io/anowodzinski/pen/ZWKXPQ
	function MoonPainter( canvas, color, texture ) {
		this.width = canvas.width;
		this.height = canvas.height;
		this.lineWidth = 10;
		this.radius = canvas.width / 2 - this.lineWidth / 2;
		this.phaseRadius = this.radius - this.lineWidth / 2;
		this.offset = this.lineWidth / 2;

		this.canvas = canvas;
		this.color = color;
		this.ctx = canvas.getContext( '2d' );

		this.canvas1 = document.createElement('canvas');
		this.canvas1.width = this.width;
		this.canvas1.height = this.height;
		this.canvas1.style.display = "none";
		this.ctx1 = this.canvas1.getContext('2d');

		this.canvas2 = document.createElement('canvas');
		this.canvas2.width = this.width;
		this.canvas2.height = this.height;
		this.canvas2.style.display = "none";
		this.ctx2 = this.canvas2.getContext('2d');

		this.pattern = this.color;
		this.texture = texture;
	}

	MoonPainter.prototype = {
		_drawDisc: function(phase) {
			this.ctx2.translate( this.offset, this.offset ) ;
			this.ctx2.beginPath();
			this.ctx2.arc( this.radius, this.radius, this.radius, 0, 2 * Math.PI, true );
			this.ctx2.closePath();
			if (this.pattern == this.color && this.texture.complete) {
				this.pattern = this.ctx1.createPattern(this.texture, "no-repeat");
			}
			this.ctx2.fillStyle = this.pattern;
			this.ctx2.fill();			

			if (phase <= 0.5) {
				this.ctx2.globalCompositeOperation = 'destination-out';
			} else {
				this.ctx2.globalCompositeOperation = 'destination-in';
			}
			this.ctx2.drawImage(this.canvas1, 0, 0);
		},

		_drawOutline: function() {
			this.ctx.drawImage(this.canvas2, 0, 0);
			this.ctx.translate( this.offset, this.offset ) ;
			this.ctx.beginPath();
			this.ctx.arc( this.radius, this.radius, this.radius, 0, 2 * Math.PI, true );
			this.ctx.closePath();
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.strokeStyle = this.color;
			this.ctx.stroke();
		},

		_drawPhase: function( phase ) {
			if (phase <= 0.5) {
				phase = 0.25 - phase;
			} else {
				phase = 0.75 - phase
			}
			phase *= -4;

			this.ctx1.beginPath();
			this.ctx1.arc( this.radius, this.radius, this.phaseRadius, -Math.PI/2, Math.PI/2, true );
			this.ctx1.fill();

			this.ctx1.translate( this.radius, this.radius );
			this.ctx1.scale( phase, 1 );
			this.ctx1.translate( -this.radius, -this.radius );
			this.ctx1.beginPath();
			this.ctx1.arc( this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true );
			
			if (phase > 0) {
				this.ctx1.globalCompositeOperation = 'destination-out';
			} else {
				this.ctx1.globalCompositeOperation = 'source-over';
			}
			
			this.ctx1.closePath();
			this.ctx1.fillStyle = '#000';
			this.ctx1.fill();
		},
		
		/**
		 * @param {Number} The phase expressed as a float in [0,1] range .
		 */	
		paint( phase ) {
			this.ctx.save();
			this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
			this.ctx1.save();
			this.ctx1.clearRect( 0, 0, this.canvas.width, this.canvas.height );
			this.ctx2.save();
			this.ctx2.clearRect( 0, 0, this.canvas.width, this.canvas.height );

			this._drawPhase( phase );
			this._drawDisc( phase );
			this._drawOutline();

			this.ctx.restore();	
			this.ctx1.restore();
			this.ctx2.restore();	
		}
	}

	Object.values(moons).forEach(moon => {
		moon.painter = new MoonPainter(document.getElementById(moon.initial + 'canvas'), moon.color, moon.texture);
		console.log(moon.workingName + " painter initialized");
	});
	

	function repaint(moon, currentPhase) {
		moon.painter.paint( 1 - (currentPhase/360));
	}
	
	let daysPerMonth = 28;
	let monthsPerYear = 13;
	let yearsPerSaros = 2475;
	
	calculateMoons();
	
	$('#prevday').click(function() {
		if ($('#day').val() == 1) {
			$('#day').val(workingCalendar.monthLength);
			if ($('#month').val() == 1) {
				$('#month').val(workingCalendar.months.length);
				current = $('#year').val();
				
				if (current == 1 && workingCalendar.startingYear != 0) {
					current = 0;
				}
				$('#year').val(current-1);
			} else {
				current = $('#month').val();
				$('#month').val(current-1);
			}
		} else {
			current = $('#day').val();
			$('#day').val(current-1);
		}
		calculateMoons();
	});
	
	$('#nextday').click(function() {
		if ($('#day').val() == workingCalendar.monthLength) {
			$('#day').val(1);
			if ($('#month').val() == workingCalendar.months.length) {
				$('#month').val(1);
				current = Number($('#year').val());
				
				if (current == -1 && workingCalendar.startingYear != 0) {
					current = 0;
				}
				$('#year').val(current+1);
			} else {
				current = Number($('#month').val());
				$('#month').val(current+1);
			}
		} else {
			current = Number($('#day').val());
			$('#day').val(current+1);
		}
		calculateMoons();
	});
	
	$('#preveclipse').click(function() {
		let month = Number($('#month').val());
		let day = Number($('#day').val());
		let year = Number($('#year').val());
		let t = calcT(month, day, year);
		
		let found = false;
		while (!found && t < 20000000) {
			t --;
			let [smardaPos, prothaPos, tyrathaPos, adezoPos] = calcPositions(t);
			let [os, oc, ol, sc, sl, cl] = calcDiffs(smardaPos, prothaPos, tyrathaPos, adezoPos);
			let [OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL] = calcEclipses(os, oc, ol, sc, sl, cl);
			
			if (OS || OC || OL || SC || SL || CL || OSC || OSL || OCL || SCL || OSCL) {
				found = true;
			}
		}
		setDateFromT(t);
	});
	
	$('#nexteclipse').click(function() {
		let month = Number($('#month').val());
		let day = Number($('#day').val());
		let year = Number($('#year').val());
		let t = calcT(month, day, year);
		
		let found = false;
		while (!found && t > -20000000) {
			t ++;
			let [smardaPos, prothaPos, tyrathaPos, adezoPos] = calcPositions(t);
			let [os, oc, ol, sc, sl, cl] = calcDiffs(smardaPos, prothaPos, tyrathaPos, adezoPos);
			let [OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL] = calcEclipses(os, oc, ol, sc, sl, cl);
			
			if (OS || OC || OL || SC || SL || CL || OSC || OSL || OCL || SCL || OSCL) {
				found = true;
			}
		}
		setDateFromT(t);
	});
	
	$('#prev3eclipse').click(function() {
		let month = Number($('#month').val());
		let day = Number($('#day').val());
		let year = Number($('#year').val());
		let t = calcT(month, day, year);
		
		let found = false;
		while (!found) {
			t --;
			let [smardaPos, prothaPos, tyrathaPos, adezoPos] = calcPositions(t);
			let [os, oc, ol, sc, sl, cl] = calcDiffs(smardaPos, prothaPos, tyrathaPos, adezoPos);
			let [OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL] = calcEclipses(os, oc, ol, sc, sl, cl);
			
			if (OSC || OSL || OCL || SCL || OSCL) {
				found = true;
			}
		}
		setDateFromT(t);
	});
	
	$('#next3eclipse').click(function() {
		let month = Number($('#month').val());
		let day = Number($('#day').val());
		let year = Number($('#year').val());
		let t = calcT(month, day, year);
		
		let found = false;
		while (!found) {
			t ++;
			let [smardaPos, prothaPos, tyrathaPos, adezoPos] = calcPositions(t);
			let [os, oc, ol, sc, sl, cl] = calcDiffs(smardaPos, prothaPos, tyrathaPos, adezoPos);
			let [OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL] = calcEclipses(os, oc, ol, sc, sl, cl);
			
			if (OSC || OSL || OCL || SCL || OSCL) {
				found = true;
			}
		}
		setDateFromT(t);
	});
	
	function setDateFromT(t) {
		
		let monthsPerYear = workingCalendar.months.length;
		let daysPerMonth = workingCalendar.monthLength;
		let daysPerYear = monthsPerYear * daysPerMonth;
		let setYear, setMonth, setDay;
		
		if (t >= 0) {
			let trem = t % daysPerYear;
			setYear = ((t - trem) / daysPerYear) + workingCalendar.startingYear;
			
			let t2rem = trem % daysPerMonth;
			setMonth = 1+ (trem - t2rem) / daysPerMonth;
			
			setDay = t2rem + 1;
			
		} else {
			let trem = t % daysPerYear;
			setYear = t - trem - 1;
			
			let t2rem = trem % daysPerMonth;
			setMonth = monthsPerYear + ((trem - t2rem) / daysPerMonth);
			
			setDay = daysPerMonth + t2rem;
		}
		
		$('#year').val(setYear);
		$('#month').val(setMonth);
		$('#day').val(setDay);
		calculateMoons();
	}

	$('#month').change(function() { calculateMoons() });
	$('#day').change(function() { calculateMoons() });
	$('#year').change(function() { calculateMoons() });

	
	function calcPositions(t) {
		
		let smardaAngVel = 360 / moons.smarda.orbit;
		let prothaAngVel = 360 / moons.protha.orbit;
		let tyrathaAngVel = 360 / moons.tyratha.orbit;
		let adezoAngVel = 360 / moons.adezo.orbit;
		
		let smardaPos = moons.smarda.offset * smardaAngVel;
		let prothaPos = moons.protha.offset * prothaAngVel;
		let tyrathaPos = moons.tyratha.offset * tyrathaAngVel;
		let adezoPos = moons.adezo.offset * adezoAngVel;
		
		smardaPos += t * smardaAngVel * moons.smarda.direction;
		prothaPos += t * prothaAngVel * moons.protha.direction;
		tyrathaPos += t * tyrathaAngVel * moons.tyratha.direction;
		adezoPos += t * adezoAngVel * moons.adezo.direction;
		
		smardaPos = smardaPos % 360;
		prothaPos = prothaPos % 360;
		tyrathaPos = tyrathaPos % 360;
		adezoPos = adezoPos % 360;

		if (smardaPos < 0) {
			smardaPos += 360;
		}
		if (prothaPos < 0) {
			prothaPos += 360;
		}
		if (tyrathaPos < 0) {
			tyrathaPos += 360;
		}
		if (adezoPos < 0) {
			adezoPos += 360;
		}
	
		return [smardaPos, prothaPos, tyrathaPos, adezoPos];
	}
	
	function calcT(month, day, year) {
		console.log(month, day, year);
		let t = 0;
		
		let monthsPerYear = workingCalendar.months.length;
		let daysPerMonth = workingCalendar.monthLength;
		
		if (year >= 0) { 
			year = year - workingCalendar.startingYear; 
			
			t += year * monthsPerYear * daysPerMonth;
			
			t += (month - 1) * daysPerMonth;
			
			t += (day - 1);
			
		} else {
			year = year + 1; 
			
			t += year * monthsPerYear * daysPerMonth;
			t -= (monthsPerYear - month) * daysPerMonth;
			t -= (daysPerMonth - day + 1);
		}
		
		return t;
	}
	
	function calcDiffs(smardaPos, prothaPos, tyrathaPos, adezoPos) {
		let os = smardaPos - prothaPos;
		let oc = smardaPos - tyrathaPos;
		let ol = smardaPos - adezoPos;
		let sc = prothaPos - tyrathaPos;
		let sl = prothaPos - adezoPos;
		let cl = tyrathaPos - adezoPos;
		return [os, oc, ol, sc, sl, cl];
	}
	
	function calcEclipses(os, oc, ol, sc, sl, cl) {
	
	let OS = false;
	let OC = false;
	let OL = false;
	let SC = false;
	let SL = false;
	let CL = false;
	let OSC = false;
	let OSL = false;
	let OCL = false;
	let SCL = false;
	let OSCL = false;
		
		if (os == 0) {
				if (oc == 0) {
					if (ol == 0) {
						OSCL = true;
					} else {
						OSC = true;
					}
				} else {
					if (ol == 0) {
						OSL = true;
					} else {
						OS = true;
					}
				}
			} else {
				if (oc == 0) {
					if (ol == 0) {
						OCL = true;
					} else {
						OC = true;
					}
				} else {
					if (ol == 0) {
						OL = true;
					} else {
						if (sc == 0) {
							if (sl == 0) {
								SCL = true;
							} else {
								SC = true;
							}
						} else {
							if (sl == 0) {
								SL = true;
							} else {
								if (cl == 0) {
									CL = true;
								}
							}
						}
					}
				}
			}
		
		return [OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL];
	}
	
	function getEclipseString(OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL) {
		if (OS) {
			return "<span class='gray'>" + moons.protha.workingName + "</span>-<span class='green'>" + moons.smarda.workingName + "</span>";
		} else if (OC) {
			return "<span class='red'>" + moons.tyratha.workingName + "</span>-<span class='green'>" + moons.smarda.workingName + "</span>";
		} else if (OL) {
			return "<span class='black'>" + moons.adezo.workingName + "</span>-<span class='green'>" + moons.smarda.workingName + "</span>";
		} else if (SC) {
			return "<span class='gray'>" + moons.protha.workingName + "</span>-<span class='red'>" + moons.tyratha.workingName + "</span>";
		} else if (SL) {
			return "<span class='gray'>" + moons.protha.workingName + "</span>-<span class='black'>" + moons.adezo.workingName + "</span>";
		} else if (CL) {
			return "<span class='red'>" + moons.tyratha.workingName + "</span>-<span class='black'>" + moons.adezo.workingName + "</span>";
		} else if (OSC) {
			return "<span class='gray'>" + moons.protha.workingName + "</span>-<span class='red'>" + moons.tyratha.workingName + "</span>-<span class='green'>" + moons.smarda.workingName + "</span>";
		} else if (OSL) {
			return "<span class='gray'>" + moons.protha.workingName + "</span>-<span class='black'>" + moons.adezo.workingName + "</span>-<span class='green'>" + moons.smarda.workingName + "</span>";
		} else if (OCL) {
			return "<span class='red'>" + moons.tyratha.workingName + "</span>-<span class='black'>" + moons.adezo.workingName + "</span>-<span class='green'>" + moons.smarda.workingName + "</span>";
		} else if (SCL) {
			return "<span class='gray'>" + moons.protha.workingName + "</span>-<span class='red'>" + moons.tyratha.workingName + "</span>-<span class='black'>" + moons.adezo.workingName + "</span>";
		} else if (OSCL) {
			return "<span class='gray'>" + moons.protha.workingName + "</span>-<span class='red'>" + moons.tyratha.workingName + "</span>-<span class='black'>" + moons.adezo.workingName + "</span>-<span class='green'>" + moons.smarda.workingName + "</span>";
		} else {
			return "";
		}
	}
	
	function calcPhase(pos, moon) {
		console.log(moon, pos);
		if (pos == 360 || pos == 0) { return "New Moon"; }
		if (pos < 90) { return "Waxing Crescent"; }
		if (pos == 90) { return "First Quarter"; }
		if (pos < 180) { return "Waxing Gibbous"; }
		if (pos == 180) { return "Full Moon"; }
		if (pos < 270) { return "Waning Gibbous"; }
		if (pos == 270) { return "Last Quarter"; }
		if (pos < 360) { return "Waning Crescent"; }
	}
	
	function calcWeekday(t) {
		t += workingCalendar.dayOffset;
		let index = t % workingCalendar.weekdays.length;
		$('#weekday').text(workingCalendar.weekdays[index]);
	}
	
	function calculateMoons() {
		
		$('#errors').empty();
		
		let month = Number($('#month').val());
		let day = Number($('#day').val());
		let year = Number($('#year').val());
		
		if (year % 1 != 0) { $('#errors').append("Error: Non-Integer Years Not Allowed"); return; }
		if (year == 0 && workingCalendar.startingYear != 0) { $('#errors').append("Error: No Year 0"); return; }
		
		$('#sinfo').empty();
		$('#pinfo').empty();
		$('#tinfo').empty();
		$('#ainfo').empty();
		$('#eclipsediv').empty();
		
		
		let t = calcT(month, day, year);
		
		let weekday = calcWeekday(t);
	
		let [smardaPos, prothaPos, tyrathaPos, adezoPos] = calcPositions(t);
		
		let [os, oc, ol, sc, sl, cl] = calcDiffs(smardaPos, prothaPos, tyrathaPos, adezoPos);
		
		let [OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL] = calcEclipses(os, oc, ol, sc, sl, cl);
		
		let eclipseString = getEclipseString(OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL);
		$('#eclipsediv').append("<p>" + (eclipseString != "" ? "Eclipse: " : "") + eclipseString + "</p>");
		
		$('#sinfo').append(calcPhase(smardaPos, "o"));
		$('#pinfo').append(calcPhase(prothaPos, "s"));
		$('#tinfo').append(calcPhase(tyrathaPos, "c"));
		$('#ainfo').append(calcPhase(adezoPos, "l"));
		
		if(!moons.smarda.painter || !moons.protha.painter || !moons.tyratha.painter || !moons.adezo.painter) {
			$('#errors').append("Error: Moon textures not loaded yet");
			return;
		}
		repaint(moons.smarda, smardaPos);
		repaint(moons.protha, prothaPos);
		repaint(moons.tyratha, tyrathaPos);
		repaint(moons.adezo, adezoPos);
		
	}	