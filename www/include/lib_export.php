<?php

	##############################################################################

	function export_default_filehandle(){

		$fh = fopen("php://stdout", "w");
		return $fh;
	}

	##############################################################################

	function export_massage_checkin(&$row){
		# note the pass-by-ref

		unset($row['venue']);
	}

	##############################################################################
?>
