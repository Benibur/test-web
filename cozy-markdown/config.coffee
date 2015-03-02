exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
      order:
        # Files in `vendor` directories are compiled before other files
        # even if they aren't specified in order.before.
        before: [
          'vendor/scripts/jquery-1.8.2.js',
          'vendor/scripts/underscore-1.4.0.js'
        ]
        # after: [
        #   'vendor/scripts/jquery-1.8.2.js',
        #   'vendor/scripts/underscore-1.4.0.js'
        # ]

    stylesheets:
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/

    templates:
        defaultExtension: 'jade'
        joinTo: 'javascripts/app.js'
