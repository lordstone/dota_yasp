// This is the js file for center page
window.onload = function loadMatches()
{
	// This is to request for match details given the match_id the
	// user has uploaded or requested
	var match_entries = $(".match_entry");
	for(match_entry in match_entries){
		var match_id = match_entry.getChild('td').val;
		poll(match_id, function(results){
			match_entry.getChild('td').html(results.picks_bans);
			match_entry.getChild('td').html(results.overviews);
			
		});
	}  
	
	function poll(match_id, results){
		$.ajax(
		{
			url: "/api/brief_match?id=" + match_id		
		}).done(function(results)
		{
			console.log(results);
		};

	}
	
}


