<?PHP
$name=$_POST['name_txt'];
$email=$_POST['email_txt'];
$comments=$_POST['message_txt'];
$food=$_POST['food'];
$service=$_POST['service'];
$clean=$_POST['clean'];
$experience=$_POST['experience'];

$to = "lemagicbullet@gmail.com";
$subject = "Message from online portfolio";
$message = "Name: " . $name;
$message .= "\nEmail: " . $email;
$message .= "\n\nMessage: " . $comments;
$message .= "\n food: " .$food;
$message .= "\n service: " .$service;
$message .= "\n cleanliness: " .$clean;
$message .= "\n experience: " .$experience;
$headers = "From: $email_txt";
$headers .= "\nReply-To: $email_txt";

$sentOk = mail($to,$subject,$message,$headers);

echo "sentOk=" . $sentOk;

?>
