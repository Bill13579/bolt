<?php

/**
Plugin Name: Bolt Video Player
Description: Bolt is a powerful video player. It can show any mp4 video and is very easy to use.
Version: 1.0.0
Author: Bill Kudo
Author URI: http://www.IdeaAcademy.com/
License: GNU AGPL-3.0
*/

function bolt_load_scripts() {
	$plugin_root = plugin_dir_url( __FILE__ );
	wp_enqueue_style( 'bolt_player_css', $plugin_root . 'css/player.css' );
	wp_enqueue_script( 'bolt_player_js', $plugin_root . 'js/player.js', array(), '1.0.0', true );
	$data = array(
		'plugin_root' => $plugin_root
	);
	wp_localize_script( 'bolt_player_js', 'data', $data );
}
add_action( 'wp_enqueue_scripts', 'bolt_load_scripts' );

// [bolt_video_player url="url"]
function bolt_video_player( $atts ) {
	$a = shortcode_atts( array(
		'mp4' => '',
		'webm' => '',
		'ogg' => '',
		'width' => '100%',
		'height' => '360px'
	), $atts );
	return "
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset='UTF-8' />
		<link rel='stylesheet' type='text/css' href='css/player.css' />
	</head>
	<body>
		<div id='bolt-video-container' style='width: " . $a["width"] . "; height: " . $a["height"] . ";'>
			<ul id='bolt-context-menu'>
				<li class='bolt-context-menu-item' data-action='mute'><div class='bolt-context-menu-item-checked bolt-click-through' id='bolt-context-menu-item-mute-check'><img /></div><span class='bolt-click-through' data-text='Mute Audio'></span></li>
				<li class='bolt-context-menu-item' data-action='loop'><div class='bolt-context-menu-item-checked click-through' id='bolt-context-menu-item-loop-check'><img /></div><span class='bolt-click-through' data-text='Loop'></span></li>
			</ul>
			<div id='bolt-video-wrapper'>
				<div class='bolt-loader' id='bolt-video-loader'><div></div></div>
				<video id='bolt-video' controls preload='metadata' style='display: block;'>
					<source src='" . $a["mp4"] . "' type='video/mp4' />
					<source src='" . $a["webm"] . "' type='video/webm' />
					<source src='" . $a["ogg"] . "' type='video/ogg' />
				</video>
			</div>
			<div id='bolt-player-controls-container'>
				<div id='bolt-player-controls-header'>
					<span id='bolt-player-controls-current-time'></span>
				</div>
				<div id='bolt-player-controls-top'>
					<input type='range' id='bolt-player-controls-progress' class='bolt-player-range-input' value='0' min='0' max='100' />
				</div>
				<div id='bolt-player-controls-l'>
					<div id='bolt-player-controls-playpause' class='bolt-button'></div>
				</div>
				<div id='bolt-player-controls-r'>
					<div id='bolt-player-controls-vol'>
						<div id='bolt-player-controls-mute' class='bolt-button' style='display: inline-block;'></div>
						<input type='range' id='bolt-player-controls-volume' class='bolt-player-range-input' min='0' max='1' step='0.02' value='0.75' style='display: inline-block;' />
					</div>
					<div id='bolt-player-controls-fullscreen' class='button'></div>
				</div>
			</div>
		</div>
		<script type='text/javascript' src='js/player.js'></script>
	</body>
	</html>
	";
}
add_shortcode( 'bolt_video_player', 'bolt_video_player' );

?>
