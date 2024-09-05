class Subdiv {

    constructor() {

        this.anzahlSegmente = [];
        this.segmente = [];
        this.pointsArr = [];
		this.iter = 0;

    }
	ccSubdiv(_input, iterations) {
		if (!_input){return;}
		if (!iterations){ return;}
		console.log(_input);
		this.anzahlSegmente = this.#pointsSegmentierung(_input);
		for (let i = 0; i < this.anzahlSegmente.length; i++) {
			this.segmente = this.#dividingAlgorithm(this.anzahlSegmente[i], iterations);
			for (let a = 0; a < this.segmente.length; a++) {
				this.pointsArr.push(this.segmente[a]);
			}
		}
		return this.pointsArr;
	}

	#dividingAlgorithm(inputArray, iterations) {
		let SubDiv = [];
		if (iterations === 0) {
			SubDiv = inputArray;
		} else if (iterations > 0) {
			for (let i = 0; i < iterations; i++) {
				if (i === 0) { //trace(i);
					SubDiv = this.#SubDividingAlgorithm(inputArray);
				} else { //trace(i);
					SubDiv = this.#SubDividingAlgorithm(SubDiv);
				}
			}
		}
		return SubDiv;
	}

	#SubDividingAlgorithm(inputArray) {
		var outputArray = [];
		let a = 0;
		let i = 0;
		let SubDiv1PunkteAnzahl = inputArray.length * 2 - 3;
		outputArray.push(inputArray[0]);
		for (i; i < SubDiv1PunkteAnzahl; i++) {
			//var GenerativerSubDPunkt: Point = new Point;
			var GenerativerSubDPunkt = new Vertex(0,0,true); // vertex
			var map = {};
			map["SubDPunkt" + i] = GenerativerSubDPunkt;
			if (this.odd(i) === true) {
				let hp1x = inputArray[a].x + (inputArray[a + 1].x - inputArray[a].x) / 4 * 3;
				let hp2x = inputArray[a + 1].x + ((inputArray[a + 2].x - inputArray[a + 1].x) / 4);
				let hp1y = inputArray[a].y + (inputArray[a + 1].y - inputArray[a].y) / 4 * 3;
				let hp2y = inputArray[a + 1].y + ((inputArray[a + 2].y - inputArray[a + 1].y) / 4);
				map["SubDPunkt" + i].x = (hp2x + hp1x) / 2;
				map["SubDPunkt" + i].y = (hp1y + hp2y) / 2;
				a++;
			} else {
				map["SubDPunkt" + i].x = (inputArray[a + 1].x + inputArray[a].x) / 2;
				map["SubDPunkt" + i].y = (inputArray[a + 1].y + inputArray[a].y) / 2;
			}
			outputArray.push(map["SubDPunkt" + i]);
		}
		outputArray.push(inputArray[a + 1]);
		return outputArray;
	}

	odd(numero) { //check if the number is odd or even
		if (numero % 2 === 0) {
			return false;
		} else {
			return true;
		}
	}
	
	#pointsSegmentierung(_input) { //trace("input: " + _input);
		let _output = []; //Erstellt ein Array mit Arrays der Segmente //var from:int = 0;//Zählt die Anzahl der Segmente, in die die Kurve unterteilt werden soll //var hart:int = 0;//Zählt die Anzahl der false statements
		let a = 0; //var s:int = 0; //var arrayVertex:Vertex;
		let i = 0; 
		let _arrayCuts = [];
		let _shifted;
		//let _inputAdd = [];
		let _generativesSegment; // bestimmung der segmentezahl
		for (i = 0; i < _input.length; i++) {
			if (_input[i].corner === false) {
				_arrayCuts.push(i);
			}
		} //trace("cuts " + _arrayCuts);
		if (_input[0].corner === true && _arrayCuts.length > 0) {
			_shifted = [];
			for (i = _arrayCuts[0]; i < _input.length; i++) {
				_shifted.push(_input[i]);
			}
			for (i = 0; i < _arrayCuts[0]; i++) {
				_shifted.push(_input[i]);
			}
			_shifted.push(_shifted[0]);
		}
		if (_arrayCuts.length === 0) {
			_shifted = [];
			_shifted.push(_input[_input.length - 1]);
			for (i = 0; i < _input.length; i++) {
				_shifted.push(_input[i]);
			}
			_shifted.push(_input[0]);
			_output.push(_shifted);
		} else if (_input[0].corner === true) {
			console.log("WCorner ") ;
			a = 0;
			for (i = 1; i < _shifted.length; i++) {
				if (_shifted[i].corner === false) {
					_generativesSegment = [];
					_generativesSegment = _shifted.slice(a, i + 1);
					a = i;
					_output.push(_generativesSegment);
				}
			}
		} else {
			a = 0;
			_shifted = [];
			for (i = 0; i < _input.length; i++) {
				_shifted.push(_input[i]);
			}
			_shifted.push(_input[0]);
			for (i = 1; i < _shifted.length; i++) {
				if (_shifted[i].corner === false) {
					_generativesSegment = [];
					_generativesSegment = _shifted.slice(a, i + 1);
					a = i;
					_output.push(_generativesSegment);
				}
			}
		}
		return _output;
	}
}
	
