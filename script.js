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
	months: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"],
	monthOffset: 0,
	monthLength: 40,
	weekdays: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"],
	dayOffset: 0
};

const moons = {
	smarda: {orbit: 25, offset: 12.5, celestial: "Eovena", draconic: "Ainissa", atyniaDraconic: "Smarda", color: '#548235', direction: '1', workingName: ""},
	protha: {orbit: 40, offset: 20, celestial: "Arsomna", draconic: "Protha", color: '#A5A5A5', direction: '1', workingName: ""},
	tyratha: {orbit: 80, offset: 40, celestial: "Gilvida", draconic: "Tyratha", color: '#C00000', direction: '1', workingName: ""},
	adezo: {orbit: 401, offset: 200.5, celestial: "Halmenda", draconic: "Adezo", color: '#a341aa', direction: '1', workingName: ""}
};

const smardaTxt = new Image();
smardaTxt.src = "smarda-texture.png";

const tyrathaTxt = new Image();
tyrathaTxt.src = "tyratha-texture.png";

const prothaTxt = new Image();
prothaTxt.src = "protha-texture.png";

const adezoTxt = new Image();
adezoTxt.src = "adezo-texture.png";

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
		this.lineWidth = 10;
		this.radius = canvas.width / 2 - this.lineWidth / 2;
		this.offset = this.lineWidth / 2;

		this.canvas = canvas;
		this.color = color;
		this.texture = texture;
		this.ctx = canvas.getContext( '2d' );
	}

	MoonPainter.prototype = {
		_drawDisc: function() {
			this.ctx.translate( this.offset, this.offset ) ;
			this.ctx.beginPath();
			this.ctx.arc( this.radius, this.radius, this.radius, 0, 2 * Math.PI, true );
			this.ctx.closePath();
			this.pattern = this.ctx.createPattern(this.texture, "no-repeat");
			this.ctx.fillStyle = this.pattern;
			this.ctx.strokeStyle = this.color;
			this.ctx.lineWidth = this.lineWidth;

			this.ctx.fill();			
			this.ctx.stroke();
		},

		_drawPhase: function( phase ) {
			this.ctx.beginPath();
			this.ctx.arc( this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true );
			this.ctx.closePath();
			this.ctx.fillStyle = '#FFF';
			this.ctx.fill();

			this.ctx.translate( this.radius, this.radius );
			this.ctx.scale( phase, 1 );
			this.ctx.translate( -this.radius, -this.radius );
			this.ctx.beginPath();
			this.ctx.arc( this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true );
			this.ctx.closePath();
			this.pattern = this.ctx.createPattern(this.texture, "no-repeat");
			this.ctx.fillStyle = phase > 0 ? this.pattern : '#FFF';
			this.ctx.fill();
		},
		
		/**
		 * @param {Number} The phase expressed as a float in [0,1] range .
		 */	
		paint( phase ) {
			this.ctx.save();
			this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

			if ( phase <= 0.5 ) {
				this._drawDisc();
				this._drawPhase( 4 * phase - 1 );
			} else {
				this.ctx.translate( this.radius + 2 * this.offset, this.radius + 2 * this.offset );
				this.ctx.rotate( Math.PI );
				this.ctx.translate( -this.radius, -this.radius );

				this._drawDisc();
				this._drawPhase( 4 * ( 1 - phase ) - 1 );
			}

			this.ctx.restore();		
		}
	}

	var spainter = new MoonPainter( document.getElementById( 'scanvas' ), moons.smarda.color, smardaTxt );
	var ppainter = new MoonPainter( document.getElementById( 'pcanvas' ), moons.protha.color, prothaTxt );
	var tpainter = new MoonPainter( document.getElementById( 'tcanvas' ), moons.tyratha.color, tyrathaTxt );
	var apainter = new MoonPainter( document.getElementById( 'acanvas' ), moons.adezo.color, adezoTxt );

	function repaint(painter, currentPhase) {
		if (document.getElementById('calendar').value == "Salix") {
			painter.paint( currentPhase/360 );
		} else {
			painter.paint( 1 - (currentPhase/360));
		}
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
			let [olurisPos, syldricPos, caphrielPos, lysoPos] = calcPositions(t);
			let [os, oc, ol, sc, sl, cl] = calcDiffs(olurisPos, syldricPos, caphrielPos, lysoPos);
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
			let [olurisPos, syldricPos, caphrielPos, lysoPos] = calcPositions(t);
			let [os, oc, ol, sc, sl, cl] = calcDiffs(olurisPos, syldricPos, caphrielPos, lysoPos);
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
			let [olurisPos, syldricPos, caphrielPos, lysoPos] = calcPositions(t);
			let [os, oc, ol, sc, sl, cl] = calcDiffs(olurisPos, syldricPos, caphrielPos, lysoPos);
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
			let [olurisPos, syldricPos, caphrielPos, lysoPos] = calcPositions(t);
			let [os, oc, ol, sc, sl, cl] = calcDiffs(olurisPos, syldricPos, caphrielPos, lysoPos);
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
	
	function calcDiffs(olurisPos, syldricPos, caphrielPos, lysoPos) {
		let os = olurisPos - syldricPos;
		let oc = olurisPos - caphrielPos;
		let ol = olurisPos - lysoPos;
		let sc = syldricPos - caphrielPos;
		let sl = syldricPos - lysoPos;
		let cl = caphrielPos - lysoPos;
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
		if (pos < 179) { return "Waxing Gibbous"; }
		if (pos < 180.5) { return "Full Moon"; }
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
	
		let [olurisPos, syldricPos, caphrielPos, lysoPos] = calcPositions(t);
		
		let [os, oc, ol, sc, sl, cl] = calcDiffs(olurisPos, syldricPos, caphrielPos, lysoPos);
		
		let [OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL] = calcEclipses(os, oc, ol, sc, sl, cl);
		
		let eclipseString = getEclipseString(OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL);
		$('#eclipsediv').append("<p>" + (eclipseString != "" ? "Eclipse: " : "") + eclipseString + "</p>");
		
		$('#sinfo').append(calcPhase(olurisPos, "o"));
		$('#pinfo').append(calcPhase(syldricPos, "s"));
		$('#tinfo').append(calcPhase(caphrielPos, "c"));
		$('#ainfo').append(calcPhase(lysoPos, "l"));
		repaint(spainter, olurisPos);
		repaint(ppainter, syldricPos);
		repaint(tpainter, caphrielPos);
		repaint(apainter, lysoPos);
		
	}	