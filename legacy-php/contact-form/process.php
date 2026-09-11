<?php
    // var_dump($_POST); : gives us content and details of variable $_POST

		if(isset($_POST['submit'])){

				$userName = $_POST['name'];

				$message = "Hello, " . $userName . "! Thanks for getting in touch.";

    		echo $message;
		}
		else{
			header("Location:index.php");
		}
    
?>