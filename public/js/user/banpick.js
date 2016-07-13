/* This is the js for banpick page
 * for cheuka's dota
 * by lordstone
 */
//alert('popo');
/*
window.onload()=function(){
	alert('jiji!');

};
*/


// time:

var times = {
	normalTime: 30,
	reserveTime: 130 
};

const LEFT_TIMER = 0;
const RIGHT_TIMER = 1;
const LEFT_RES_TIMER = 2;
const RIGHT_RES_TIMER = 3;

const LEFT_BAN = 0;
const RIGHT_BAN = 1;
const LEFT_PICK = 2;
const RIGHT_PICK = 3;



// status: 0: ready, 1: captain mode, 2: ended, 3: paused
var status = 0;

// phase: 0: left ban, 1: right ban, 2: left pick, 3: right pick, 4: finished
// var phase = 0;

// may be replaced by user-defined procedure
var procedure = [
	LEFT_BAN, RIGHT_BAN, LEFT_BAN, RIGHT_BAN,         // 4
	LEFT_PICK, RIGHT_PICK, RIGHT_PICK, LEFT_PICK,     // 4
	RIGHT_BAN, LEFT_BAN, RIGHT_BAN, LEFT_BAN,         // 4
	RIGHT_PICK, LEFT_PICK, RIGHT_PICK, LEFT_PICK,     // 4
	RIGHT_BAN, LEFT_BAN,                              // 2
	LEFT_PICK, RIGHT_PICK                             // 2
];                                                  // 20

var is_reserved_time = false;

var radiant_reserved_time = time.reserveTime;
var dire_reserved_time = time.reserveTime;

var is_radiant_turn = true;

var cur_procedure = 0;

var hero_slot = {
	radiant_ban: [],
	radiant_pick: [],
	dire_ban: [],
	dire_pick: []
};

var timer;
var timer_secs;
var timer_cb;
var timer_index;

function button2_click(){

}

function finished(){
	setStatus('Mock BP is Finished');
}

function setStatus(msg){
	$('#main_status').html(msg);
}

function setTimerText(secs, index){
	var min = Math.floor(secs / 60);
	var sec = secs % 60;
	$('#timer_' + index).html((min<10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec);
}
// start of high level functions

function stopTimer(){
	clearTimeout(timer);
	timer_secs = 0;
}

function startReserve(){
	if(is_radiant_turn){
		timer_secs = radiant_reserved_time;
		timer_index = 2;
	}else{
		timer_secs = dire_reserved_time;
		timer_index = 3;
	}
	setTimerText(secs, timer_index);
	countDown;
}

function startBanpick(){
	// this will do: push selected hero into banpick/slot
  //               start the next timer


	cur_procedure += 1;
	timer_secs = time.normalTime;
	var cur_pos = procedure[cur_procedure];

}

function changeStatus(passed){
	if(cur_procedure < 20 && cur_procedure >= 0){
		if(passed === true){
			// if it was a passed status change
			if(is_reserved_time === false){
				// if originally not a reserve phase
				if(is_radiant_turn ? (radiant_reserved_time > 0) : (dire_reserved_time > 0)){
					// if still has reserve time
					startReserve();
				}else{
					// random pick
					randomPick();
				}
			}else{
				// if already in reserve time phase
				randomPick();
			}
		}else{
			// if it was a clicked status change
			if(is_reserved_time === true){
				is_reserved_time = false;
				if(is_radiant_turn){
					radiant_reserved_time = timer_secs;
				}else{
					dire_reserved_time = timer_secs;
				}
				stopTimer();
			}
			startBanpick();
		}

	}else{
		//end
		finished();
	}

}

function countDown(){
//	alert(secs);
	secs -= 1;
	setTimerText(secs, timer_index);
	if(secs === 0){
		return changeStatus(true);
	}else{
		timer = setTimeout('countDown()', 1000);
	}
}


/*
function setLeftBan(){
	setStatus('Radiant Ban');
	secs = times.normalTime;
	status = LEFT_BAN;
	timer_cb = function(){alert('time!')};
	timer_index = LEFT_TIMER;
	countDown();
}

function setRightBan(){
	setStatus('Dire Ban');
	secs = times.normalTime;
	status = RIGHT_BAN;
	timer_cb = function(){alert('time!')};
	timer_index = LEFT_TIMER;
	countDown();
}
*/

// end of high level functions

function button1_click(){
	if(status == 0){
		status = 1; // started
		$('#button1').val('Select');
		$('#button1').attr('disabled', true);
		secs = times.normalTime;
		timer_cb = function(){alert('time!')};
		timer_index = LEFT_TIMER;
		countDown();
	}
}
function pick_hero(hero_id){
	// it is working
	var tmp = $('#hero_' + hero_id);
	//var mask = $('#hero_mask_' + hero_id);
//	var tmp = document.getElementById('hero_' + hero_id);
//	tmp.css({'-web-filter': 'grayscale(100%)'});
//	tmp.addClass('gray_img');
	//mask.show();
	tmp.attr('src', '');
	tmp.css('background-color','black');
//	tmp.addClass('submit_button');
	//tmp.css('border', '2px solid white');
	//alert(hero_id);
}

$(document).ready(function(){
	//set init status
	setStatus('Ready to Start');
	status = 0;
});


