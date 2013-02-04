---
layout: default
published: true
author: neill russell
---

# How to set up WordPress Rewrites

I have finally had the opportunity to work out how to set up rewrites within WordPress. I've been wanting to for some time. 

Here's how I approached it.

	// add your rules
    $rewrite_rules = array();
    
    $post_type = "property";
	$uri = "propreties/for/rent/123-alpabet-street";
    $rewrite_rules["$uri/?$"] = "index.php?$post_type=".$post_id;
    
    // add more rules as required ... etc etc

    // save the rules as an option in the DB
    update_option('my_rewrite_rules', $rewrite_rules);
    
    // set a flag to signify a flush is required
    update_option('my_rewrite_flush_reqd', true);

    // if we have rewrite rules - import them
    add_action('generate_rewrite_rules', function($wp_rewrite) {
        $rules = get_option('my_rewrite_rules', array());
        if($wp_rewrite->rules && is_array($wp_rewrite->rules)) {
            $wp_rewrite->rules = $rules + $wp_rewrite->rules;
        }
        else $wp_rewrite->rules = $rules;
        return $wp_rewrite->rules;
    });

    // if rewrite flush flag is set - then flush 
    add_action('init', function() {
        if($flush_reqd = get_option('my_rewrite_flush_reqd', null)) {
            global $wp_rewrite;
            $wp_rewrite->flush_rules();
            delete_option('my_rewrite_flush_reqd');
        }
    });
    
    
## Writing to the .htaccess file

We can also flush rewrites to the .htaccess file. Rewrites take the form of:

	RewriteRule ^propreties/for/rent/123-alpabet-street$ /abc [QSA,L]

It is advised to do this on 'admin init' as there a performance implications on writing to the .htaccess file on every request. Better yet set a flag to signify a flush is needed.

Very similar to the code above, here's how to:
    
    // add your rules
    $rewrite_rules = array();
    
    $post_type = "property";
	$uri = "propreties/for/rent/123-alpabet-street";
    $rewrite_rules["$uri/?$"] = "http://example.com/abc";
    
    // add more rules as required ... etc etc

    // save the rules as an option in the DB
    update_option('my_nonwp_rewrite_rules', $rewrite_rules);
    
    // set a flag to signify a flush is required
    update_option('my_nonwp_rewrite_flush_reqd', true);

    // if we have rewrite rules - import them
    add_action('generate_rewrite_rules', function() {
    	global $wp_rewrite;
        $non_wp_rules = get_option('my_nonwp_rewrite_rules', array());
        if($wp_rewrite->non_wp_rules && is_array($wp_rewrite->non_wp_rules)) {
            $wp_rewrite->non_wp_rules = $rules + $wp_rewrite->non_wp_rules;
        }
        else $wp_rewrite->non_wp_rules = $non_wp_rules;
    });
    
    // we can have non WP rewrites flushed to the .htaccess file too
    add_action('admin_init', function() {
        if($flush_reqd = get_option('my_nonwp_rewrite_flush_reqd', null)) {
            global $wp_rewrite;
            $wp_rewrite->flush_rules();
            delete_option('my_nonwp_rewrite_flush_reqd');
        }
    });