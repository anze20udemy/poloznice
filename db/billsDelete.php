<?php
include_once ('db.php');

$query = $_POST['query'];

if(mysqli_query($conn,$query))
  echo "Vnos je zbirsan";
else
  echo"Did not delete";