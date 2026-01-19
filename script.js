// MoonPainter code modified from https://codepen.io/anowodzinski/pen/ZWKXPQ
	function MoonPainter( canvas, color ) {
		this.lineWidth = 10;
		this.radius = canvas.width / 2 - this.lineWidth / 2;
		this.offset = this.lineWidth / 2;

		this.canvas = canvas;
		this.color = color;
		this.ctx = canvas.getContext( '2d' );
	}

	MoonPainter.prototype = {
		_drawDisc: function() {
			this.ctx.translate( this.offset, this.offset ) ;
			this.ctx.beginPath();
			this.ctx.arc( this.radius, this.radius, this.radius, 0, 2 * Math.PI, true );
			this.ctx.closePath();
			this.ctx.fillStyle = this.color;
			this.ctx.strokeStyle = this.color;
			this.ctx.lineWidth = this.lineWidth;

			this.ctx.fill();			
			this.ctx.stroke();
		},

		_drawPhase: function( phase ) {
			this.ctx.beginPath();
			this.ctx.arc( this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true );
			this.ctx.closePath();
			this.ctx.fillStyle = '#000';
			this.ctx.fill();

			this.ctx.translate( this.radius, this.radius );
			this.ctx.scale( phase, 1 );
			this.ctx.translate( -this.radius, -this.radius );
			this.ctx.beginPath();
			this.ctx.arc( this.radius, this.radius, this.radius, -Math.PI/2, Math.PI/2, true );
			this.ctx.closePath();
			this.ctx.fillStyle = phase > 0 ? this.color : '#000';
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


	var opainter = new MoonPainter( document.getElementById( 'ocanvas' ), 'BlueViolet' );
	var spainter = new MoonPainter( document.getElementById( 'scanvas' ), 'Green' );
	var cpainter = new MoonPainter( document.getElementById( 'ccanvas' ), 'White' );
	var lpainter = new MoonPainter( document.getElementById( 'lcanvas' ), 'Red' );

	function repaint(painter, currentPhase) {
		if (document.getElementById('planetoid').value == "Salix") {
			painter.paint( currentPhase/360 );
		} else {
			painter.paint( 1 - (currentPhase/360));
		}
	}
	
	let daysPerMonth = 28;
	let monthsPerYear = 13;
	let yearsPerSaros = 2475;
	
	checkFields();
	calculateMoons();
	
	$('#prevday').click(function() {
		if ($('#biennial').prop("checked")) {
			$('#biennial').prop("checked", false);
			$('#monthday').show();
			$('#month').val(13);
			$('#day').val(28);
			current = $('#year').val();
			if (current == 0) {
				$('#saros').val(1);
				$('#year').val(yearsPerSaros-1);
				$('#biennialdiv').hide();
			} else {
				$('#year').val(current-1);
			}
		} else {
			if ($('#day').val() == 1) {
				$('#day').val(28);
				if ($('#month').val() == 1) {
					$('#month').val(13);
					if (($('#year').val() % 2) == 0 && $('#saros').val() == 2) {
						$('#biennial').prop("checked", true);
						$('#monthday').hide();
					} else {
						current = $('#year').val();
						$('#year').val(current-1);
					}
				} else {
					current = $('#month').val();
					$('#month').val(current-1);
				}
			} else {
				current = $('#day').val();
				$('#day').val(current-1);
			}
		}
		calculateMoons();
	});
	
	$('#nextday').click(function() {
		if ($('#biennial').prop("checked")) {
			$('#biennial').prop("checked", false);
			$('#monthday').show();
			$('#month').val(1);
			$('#day').val(1);
			current = $('#year').val();
		} else if ($('#year').val() == 2474 && $('#saros').val() == 1 && $('#month').val() == 13 && $('#day').val() == 28) {
			$('#saros').val(2);
			$('#year').val(0);
			$('#biennial').prop("checked", true);
			$('#monthday').hide();
			$('#biennialdiv').show();
		} else {
			if ($('#day').val() == 28) {
				$('#day').val(1);
				if ($('#month').val() == 13) {
					$('#month').val(1);
					if (($('#year').val() % 2) != 0 && $('#saros').val() == 2) {
						$('#biennial').click();
					}
					current = Number($('#year').val());
					$('#year').val(current+1);
				} else {
					current = Number($('#month').val());
					$('#month').val(current+1);
				}
			} else {
				current = Number($('#day').val());
				$('#day').val(current+1);
			}
		}
		calculateMoons();
	});
	
	$('#preveclipse').click(function() {
		let month = Number($('#month').val());
		let day = Number($('#day').val());
		let year = Number($('#year').val());
		let saros = Number($('#saros').val());
		let t = calcT(month, day, year, saros, $('#biennial').prop("checked"));
		
		let found = false;
		while (t >= 300300 && !found) {
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
		let saros = Number($('#saros').val());
		let t = calcT(month, day, year, saros, $('#biennial').prop("checked"));
		
		let found = false;
		while (!found) {
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
		let saros = Number($('#saros').val());
		let t = calcT(month, day, year, saros, $('#biennial').prop("checked"));
		
		let found = false;
		while (t >= 300300 && !found) {
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
		let saros = Number($('#saros').val());
		let t = calcT(month, day, year, saros, $('#biennial').prop("checked"));
		
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
	
	function checkFields() {
		if (Number($('#saros').val()) == 1 || Number($('#year').val()) % 2 == 1) {
			$('#biennialdiv').hide();
			$('#monthday').show();
			$('#biennial').prop("checked", false);
		} else {
			$('#biennialdiv').show();
			if ($('#biennial').prop("checked") == true) {
				$('#monthday').hide();
			} else {
				$('#monthday').show();
			}
				
		}
	}
		
	
	function setDateFromT(t) {
		if (t < 1201200) {
			$("#saros").val(1);
			$('#biennialdiv').hide();
			$('#monthday').show();
			
			t -= 300300;
			tRem = t % 364;
			newYear = (t - tRem) / 364;
			newDay = (tRem % 28) + 1;
			newMonth = (tRem - (tRem % 28)) / 28 + 1;
			
			$('#year').val(newYear);
			$('#month').val(newMonth);
			$('#day').val(newDay);
			
		} else {
			$("#saros").val(2);
			$('#biennialdiv').show();
			
			t -= 1201200;
			
			t2rem = t % 729;
			
			newYear = (t - t2rem) / 729 * 2;
			
			if (t2rem > 364) {
				t2rem -= 364;
				newYear += 1;
			}
			
			t2rem -= 1;
			
			newDay = (t2rem % 28) + 1;
			newMonth = (t2rem - (t2rem % 28)) / 28 + 1;
			
			if (t2rem == 0) {
				$('#biennial').prop("checked", true);
				$('#monthday').hide();
			}
			
			$('#year').val(newYear);
			$('#month').val(newMonth);
			$('#day').val(newDay);
			
		}
		
		calculateMoons();
	}
	
	if ($('#biennial').prop("checked") && $('#saros').val() == '2') {
		$('#monthday').hide();
	} else {
		$('#monthday').show();
	}
	
	$('#biennial').click(function() {
		if ($('#saros').val() == 2) {
			if ($('#biennial').prop("checked")) {
				$('#monthday').hide();
			} else {
				$('#monthday').show();
			}
		}
	});
	
	if ($('#saros').val() == '1') {
		$('#biennialdiv').hide();
	} else {
		$('#biennialdiv').show();
	}
	
	$('#planetoid').change(function() { calculateMoons() });
	$('#biennial').change(function() { calculateMoons() });
	$('#month').change(function() { calculateMoons() });
	$('#day').change(function() { calculateMoons() });
	$('#year').change(function() { calculateMoons() });
	$('#saros').change(function() { 
		$('#biennialdiv').toggle();
		if ($('#saros').val() == '1') {
			$('#monthday').show();
		} else if ($('#biennial').prop("checked")) {
			$('#monthday').hide();
		}
		calculateMoons();
	});
	
	function calcPositions(t) {
		//offset of lunar nodes
		let degPerYear = 240 / 825;
		let degPerDayPreRift = degPerYear / (daysPerMonth * monthsPerYear);
		let degPerDayPostRift = degPerYear / ((daysPerMonth * monthsPerYear) + .5);
		
		let olurisOrbit = 28;
		let syldricOrbit = -44;
		let caphrielOrbit = -100;
		let lysoOrbit = 156;
		
		let olurisAngVel = 360 / olurisOrbit;
		let syldricAngVel = 360 / syldricOrbit;
		let caphrielAngVel = 360 / caphrielOrbit;
		let lysoAngVel = 360 / lysoOrbit;
		
		let olurisPos = 0;
		let syldricPos = 0;
		let caphrielPos = 0;
		let lysoPos = 0;
		
		let olurisTotVelPreRift = olurisAngVel + degPerDayPreRift;
		let syldricTotVelPreRift = syldricAngVel + degPerDayPreRift;
		let caphrielTotVelPreRift = caphrielAngVel + degPerDayPreRift;
		let lysoTotVelPreRift = lysoAngVel + degPerDayPreRift;
	
		if ( t < 1201200) { //1st saros
			olurisPos = ((t * olurisTotVelPreRift) % 360);
			syldricPos = ((t * syldricTotVelPreRift) % 360);
			caphrielPos = ((t * caphrielTotVelPreRift) % 360);
			lysoPos = ((t * lysoTotVelPreRift) % 360);
			
		} else { //2nd saros
			let olurisTotVelPostRift = olurisAngVel + degPerDayPostRift;
			let syldricTotVelPostRift = syldricAngVel + degPerDayPostRift;
			let caphrielTotVelPostRift = caphrielAngVel + degPerDayPostRift;
			let lysoTotVelPostRift = lysoAngVel + degPerDayPostRift;
			
			let lastDayOfFirstSaros = 1201200 - 1;
			
			let daysOfSecondSaros = t - lastDayOfFirstSaros;
			
			let olurisPosRift = lastDayOfFirstSaros * olurisTotVelPreRift;
			let syldricPosRift = lastDayOfFirstSaros * syldricTotVelPreRift;
			let caphrielPosRift = lastDayOfFirstSaros * caphrielTotVelPreRift;
			let lysoPosRift = lastDayOfFirstSaros * lysoTotVelPreRift;
			
			olurisPos = (olurisPosRift + (daysOfSecondSaros * olurisTotVelPostRift)) % 360;
			syldricPos = (syldricPosRift + (daysOfSecondSaros * syldricTotVelPostRift)) % 360;
			caphrielPos = (caphrielPosRift + (daysOfSecondSaros * caphrielTotVelPostRift)) % 360;
			lysoPos = (lysoPosRift + (daysOfSecondSaros * lysoTotVelPostRift)) % 360;
		}
		
		olurisPos = Math.round(olurisPos * 100) / 100;
		syldricPos = Math.round(syldricPos * 100) / 100;
		caphrielPos = Math.round(caphrielPos * 100) / 100;
		lysoPos = Math.round(lysoPos * 100) / 100;
		
		if (olurisPos < 0) {
			olurisPos += 360;
		}
		if (syldricPos < 0) {
			syldricPos += 360;
		}
		if (caphrielPos < 0) {
			caphrielPos += 360;
		}
		if (lysoPos < 0) {
			lysoPos += 360;
		}
		
		return [olurisPos, syldricPos, caphrielPos, lysoPos];
	}
	
	function calcT(month, day, year, saros, biennial) {
		let t = 0;
		if (saros == 2 && year % 2 != 0 && biennial) {
			$('#errors').append("<p>Error: No biennial on odd year.</p>");
		} else {
		
			//calculate t
			
			t += year * daysPerMonth * monthsPerYear;
			if (saros == 2) {
				t += 1201200;
				let num_biennials = (year - (year % 2)) / 2;
				t += num_biennials;
				if (!$('#biennial').prop("checked")) {
					t += (month - 1) * daysPerMonth;
					t += day;
				}
			}
			
			if (saros == 1) {
				t += 300300; //saros begins at waning crescent
				t += (month - 1) * daysPerMonth;
				t += day - 1;
			}
			
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
			return "<span class='purple'>Oluris</span>-<span class='green'>Syldric</span>";
		} else if (OC) {
			return "<span class='purple'>Oluris</span>-<span class='gray'>Caphriel</span>";
		} else if (OL) {
			return "<span class='purple'>Oluris</span>-<span class='red'>Lyso</span>";
		} else if (SC) {
			return "<span class='green'>Syldric</span>-<span class='gray'>Caphriel</span>";
		} else if (SL) {
			return "<span class='green'>Syldric</span>-<span class='red'>Lyso</span>";
		} else if (CL) {
			return "<span class='gray'>Caphriel</span>-<span class='red'>Lyso</span>";
		} else if (OSC) {
			return "<span class='purple'>Oluris</span>-<span class='green'>Syldric</span>-<span class='gray'>Caphriel</span>";
		} else if (OSL) {
			return "<span class='purple'>Oluris</span>-<span class='green'>Syldric</span>-<span class='red'>Lyso</span>";
		} else if (OCL) {
			return "<span class='purple'>Oluris</span>-<span class='gray'>Caphriel</span>-<span class='red'>Lyso</span>";
		} else if (SCL) {
			return "<span class='green'>Syldric</span>-<span class='gray'>Caphriel</span>-<span class='red'>Lyso</span>";
		} else if (OSCL) {
			return "<span class='purple'>Oluris</span>-<span class='green'>Syldric</span>-<span class='gray'>Caphriel</span>-<span class='red'>Lyso</span>";
		} else {
			return "";
		}
	}
	
	function calcPhase(pos, moon) {
		if (moon == "o" || moon == "l") {
			if (pos > 355 || pos < 5) { return "New Moon"; }
			if (pos < 85) { return "Waxing Crescent"; }
			if (pos < 95) { return "First Quarter"; }
			if (pos < 175) { return "Waxing Gibbous"; }
			if (pos < 185) { return "Full Moon"; }
			if (pos < 265) { return "Waning Gibbous"; }
			if (pos < 275) { return "Last Quarter"; }
			if (pos < 355) { return "Waning Crescent"; }
		}
		if (moon == "s" || moon == "c") {
			if (pos > 355 || pos < 5) { return "New Moon"; }
			if (pos < 85) { return "Waning Crescent"; }
			if (pos < 95) { return "Last Quarter"; }
			if (pos < 175) { return "Waning Gibbous"; }
			if (pos < 185) { return "Full Moon"; }
			if (pos < 265) { return "Waxing Gibbous"; }
			if (pos < 275) { return "First Quarter"; }
			if (pos < 355) { return "Waxing Crescent"; }
		}
		else { return "invalid moon"; }
	}
	
	function calculateMoons() {
		
		$('#errors').empty();
		$('#oinfo').empty();
		$('#cinfo').empty();
		$('#sinfo').empty();
		$('#linfo').empty();
		$('#eclipsediv').empty();
		
		let month = Number($('#month').val());
		let day = Number($('#day').val());
		let year = Number($('#year').val());
		let saros = Number($('#saros').val());
		
		if (year >= yearsPerSaros) {
			$('#errors').append("<p>Error: After end of saros. " + yearsPerSaros + " years per saros.</p>");
			if ((saros == 1) && (year <= (2 * yearsPerSaros))) {
				$('#errors').append("<p>Equivalent to 2nd Saros " + (year - yearsPerSaros + 1) + "</p>"); 
			}
		} else if (year < 0) {
			$('#errors').append("<p>Error: No negative years.</p>");
			if (saros == 2 && (year >= (0 - yearsPerSaros))) {
				$('#errors').append("<p>Equivalent to 1st Saros " + (year + yearsPerSaros) + "</p>");
			}
		} else {
		
			let t = calcT(month, day, year, saros, $('#biennial').prop("checked"));
		
			let [olurisPos, syldricPos, caphrielPos, lysoPos] = calcPositions(t);
			
			let [os, oc, ol, sc, sl, cl] = calcDiffs(olurisPos, syldricPos, caphrielPos, lysoPos);
			
			let [OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL] = calcEclipses(os, oc, ol, sc, sl, cl);
			
			let eclipseString = getEclipseString(OS, OC, OL, SC, SL, CL, OSC, OSL, OCL, SCL, OSCL);
			$('#eclipsediv').append("<p>" + (eclipseString != "" ? "Eclipse: " : "") + eclipseString + "</p>");
			
			$('#oinfo').append(calcPhase(olurisPos, "o"));
			$('#sinfo').append(calcPhase(syldricPos, "s"));
			$('#cinfo').append(calcPhase(caphrielPos, "c"));
			$('#linfo').append(calcPhase(lysoPos, "l"));
			repaint(opainter, olurisPos);
			repaint(spainter, syldricPos);
			repaint(cpainter, caphrielPos);
			repaint(lpainter, lysoPos);
		}
		
	}	