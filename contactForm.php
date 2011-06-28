<?php
	require('scripts/validEmail.php');
	
	$sendToAddress = 'lemagicbullet@gmail.com';
	$thisPage = $_SERVER['PHP_SELF'];
	
	if(!empty($_POST)) {
		$name = $_POST['name'];
		$email = $_POST['email'];
		$message = $_POST['message'];
										
		$numErrors = 0;
		if(empty($name)) {
			$numErrors++;
			$nameError = "<span class=\"feedback\"><span>&#9754;</span> Required</span>";
		}
		
		if(empty($email)) {
			$numErrors++;
			$emailError = "<span class=\"feedback\"><span>&#9754;</span> Required</span>";
		}else{
			if (!valid_email_address($email)){
				$numErrors++;
				$emailError = "<span class=\"feedback\"><span>&#9754;</span> Invalid Email Address</span>";
			}
		}
		if(empty($message)) {
			$numErrors++;
			$messageError = "<span class=\"feedback\"><span>&#9754;</span> Required</span>";
		}
		if($numErrors == 0) {
			$name = stripslashes($name);
			$email = stripslashes($email);
			$message = stripslashes($message);
			
			$sendMessage = "Name: $name\n";
			$sendMessage .= "Email: $email\n";
			$sendMessage .= "Questions/Comments: $message";
			
			$sendMessage = str_replace("\n", "\r\n", $sendMessage);
			
			mail($sendToAddress, "Mail from tgaw.com Contact Form", $sendMessage, "From: $email");
			$name = '';
			$email = '';
			$message = '';
			
			$status = "<p id=\"status\" class=\"confirm\">Thanks, I love getting email.</p>\n";
		}else{
			$status = "<p id=\"status\" class=\"warning\">Please fix the errors below.</p>\n";
			$name = stripslashes(htmlentities($name));
			$email = stripslashes(htmlentities($email));
			$message = stripslashes($message);
		}
	}
?>
				<form id="contactForm" action="<?php echo $thisPage; ?>" method="post">
					<fieldset>
						<?php echo $status; echo "\n"; ?>
						<p>
							<label for="name">Name:* <?php echo $nameError; ?></label>
							<input id="name" name="name" type="text" value="<?php echo $name; ?>"/>
						</p>
						<p>
							<label for="email">Email:* <?php echo $emailError; ?></label>
							<input id="email" name="email" type="text" value="<?php echo $email; ?>" />
						</p>
						<p>
							<label for="message">Message:* <?php echo $messageError; ?></label>
							<textarea id="message" name="message" cols="30" rows="10"><?php echo $message; ?></textarea>
						</p>
						<p>
							<input id="submitBtn" type="submit" value="Send" />
						</p>
					</fieldset>
				</form>