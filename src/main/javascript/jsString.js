/**
 * @groupId 	>= org.cccs.jsLibs
 * @artefactId 	>= jsString
 * @version   	>= 1.0
 *
 * @name 		>= String
 * @description >= String extensions for JavaScript
 * @vcs			>= git
 * @website		>= https://github.com/BoyCook/JSLibs
 * @since     	>= 2010-07-01
 * @copyright 	>= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    	>= Ben Paddock
 */
String.prototype.startsWith = function(substring) {
	return this.substring(0, substring.length) == substring;
};
