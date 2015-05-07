var metalsmith  = require('metalsmith'),
    branch      = require('metalsmith-branch'),
    ignore      = require('metalsmith-ignore'),
    drafts      = require('metalsmith-drafts'),
    templates   = require('metalsmith-templates'),
    markdown    = require('metalsmith-markdown'),
    permalinks  = require('metalsmith-permalinks'),
    collections = require('metalsmith-collections'),
    // uglify      = require('metalsmith-uglify'),
    excerpts    = require('metalsmith-excerpts'),
    metadata    = require('metalsmith-metadata'),
    sass        = require('metalsmith-sass'),
    fingerprint = require('metalsmith-fingerprint'),
    moment      = require('moment'),
    _           = require('lodash'),
    _s          = require('underscore.string');

metalsmith(__dirname)
    .source('src')
    .destination('public')
    .use(drafts())
    .use(metadata({
        site: 'config/site.json',
        navigation: 'config/navigation.json',
        toolbox: 'config/toolbox.json'
    }))
    .use(collections({
        posts: {
            pattern: 'blog/*',
            sortBy: 'date',
            reverse: true,
        }
    }))
    .use(blogTagLists)
    .use(generateTagCloud)
    .use(branch('scss/*')
        .use(sass({
          outputStyle: "compressed",
          outputDir: 'css/'
        }))
    )
    .use(fingerprint({
        pattern: "css/*.css"
    }))
    .use(markdown({
        highlight: function (code) {
            return require('highlight.js').highlightAuto( code, [
                "javascript", "json", "html", "css", "scss", "markdown", "handlebars", "nix"
            ] ).value;
        }
    }))
    .use(branch('*.html')
        .use(branch(removeGoogleWebmasterVerify)
            .use(permalinks())
            .use(setupNavigation)
        )
    )
    .use(branch('blog/*')
        .use(getRelatedArticles)
        .use(permalinks({
            pattern: 'blog/:date/:title',
            date: 'YYYY/MM'
        }))
        .use(formatDate)
        .use(setupNavigation)
    )
    .use(excerpts())
    // .use(branch('scripts/*')
    //     .use(uglify())
    // )
    .use(branch(filterImages)
        .use(templates({
            engine: 'handlebars',
            directory: 'src/templates',
            partials: {
                headIncludes: 'partials/head-includes',
                styleIncludes: 'partials/style-includes',
                banner: 'partials/banner',
                header: 'partials/header',
                right: 'partials/right',
                footer: 'partials/footer',
                scriptIncludes: 'partials/script-includes'
            },
            helpers: {
                debug: function debug( property ) {
                    console.log( "DEBUG" );
                    console.log( "================" );
                    console.log( "Context" );
                    console.log( this );
                    if ( arguments.length > 1 ) {
                        console.log( "Value" );
                        console.log( property );
                    }
                },
                eq: function isEqual( arg1, arg2, options ) {
                    if ( arg1 === arg2 ) {
                        return options.fn( this );
                    } else {
                        if ( !!options.inverse ) {
                            return options.inverse( this );
                        } else {
                            return;
                        }
                    }
                },
                isObject: function isObject( context, options ) {
                    if ( _.isPlainObject( context ) ) {
                        return options.fn( this );
                    } else {
                        if ( !!options.inverse ) {
                            return options.inverse( this );
                        } else {
                            return;
                        }
                    }
                },
                gt: function isGreater( arg1, arg2, options ) {
                    if ( arg1 > arg2 ) {
                        return options.fn( this );
                    } else {
                        if ( !!options.inverse ) {
                            return options.inverse( this );
                        } else {
                            return;
                        }
                    }
                },
                limit: function eachLimit (array, offset, limit, options) {
                    if (!options) {
                        options = limit;
                        limit = offset;
                        offset = null;
                    }
                    var ret = "";

                    if (array && array.length > 0) {
                        var min = (offset || 0);
                        var max = Math.min(array.length, limit);
                        for (var i = min; i < max; i++) {
                            ret += options.fn(array[i]);
                        }
                    } else {
                        ret = options.inverse(this);
                    }

                    return ret;
                },
                join: function joinArray( array, joinString ) {
                    return array.join( joinString );
                },
                buildTagList: function buildTagListArray( array, joinString ) {
                    var mapped = _.map(array, function( tag ) {
                        return "<a href='/blog/tag/" + _s.slugify( tag ) + "/'>" + tag + "</a>"
                    });
                    return mapped.join( joinString );
                }
            }
        }))
    )
    .use(branch('**/*.html')
        .use(htmlMinifier({
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeAttributeQuotes: true
        }))
    )
    .use(branch('images/**/*')
        .use(imageCrusher())
    )
    .use(ignore([
        'templates/**/*',
        'config/**/*',
        'scss/**/*',
        'css/styles.css',
        'css/ie-styles.css',
        'css/highlight.css'
    ]))
    .build(function(err) {
        if (err) { throw err };
    });

function formatDate(files, metalsmith, done) {
    for ( var file in files) {
        files[file].date = moment(files[file].date).format('Do MMMM, YYYY');
    }
    done();
}

function setupNavigation(files, metalsmith, done) {
    for ( var file in files) {
        var nav = _.find( metalsmith.metadata().navigation, function( navItem ) {
            if ( _s.include(files[file].path, navItem.name) ) {
                return true;
            }
            if ( _s.include(files[file].path, "posts") && navItem.name === "blog" ) {
                return true;
            }
            return navItem.path === files[file].path;
        });
        if (nav) {
            files[file].nav = nav.name;
        }
    }
    done();
}

/* HACK */
function removeGoogleWebmasterVerify(filename, properties, index) {
    var filter = true;

    if ( filename === "google3408721816d54681.html" ) {
        filter = false;
    }

    return filter;
}

function filterImages(filename, properties, index) {
  var extension = filename.split('.').pop().toLowerCase();
  var imageExtensions = [ "jpg", "jpeg", "png", "gif", "ico" ];
  var notAnImage = imageExtensions.indexOf(extension) == -1;
  return notAnImage;
}

/* This needs looking at as not always the best related articles show based on tags */
function getRelatedArticles(files, metalsmith, done) {
    var relatedArticles = [], tags, related;

    for ( var p in files ) {
        related = [];
        tags = files[ p ].tags;
        if ( !tags ) {
            files[ p ].related = [];
        }

        for ( var i = 0, len = tags.length; i < len; i++ ) {
            relatedArticles.push( metalsmith.metadata().tags[ tags[ i ] ] );
        }

        var count = _( relatedArticles ).flatten().reject(function( article ) {
            return article.title === files[ p ].title;
        }).countBy( "title" ).map( function( value, key ) {
            return {
                key     : key,
                value   : value
            }
        }).sortBy( "value" ).reverse().value();

        for (var i = 0; i < 3; i++ ) {
            related.push ( _.where( files, { title: count[ i ].key } )[ 0 ] );
        }

        files[ p ].related = related;
    }

    done();
}

function blogTagLists(files, metalsmith, done) {
    var tag,
        tags = {},
        sortedTags = {};

    for (var p in metalsmith.data.posts) {
        for (var t in metalsmith.data.posts[p].tags) {
            tag = metalsmith.data.posts[p].tags[t];
            if (!tags[tag]) {
                tags[tag] = [];
            }

            tags[tag].push(metalsmith.data.posts[p]);
        }
    }

    Object.keys( tags ).sort().forEach(function( tag ) {
        sortedTags[tag] = tags[tag];
    });

    metalsmith.metadata().tags = sortedTags;
    metalsmith.metadata().cloudTags = tags;
    for (tag in tags) {
        files['blog/tag/' + _s.slugify( tag ) + '/index.md'] = {
            template: 'tags.html',
            mode: '0644',
            contents: '',
            title: tag,
            posts: tags[tag],
            description: "Tags relating to " + tag
        };
    }

    done();
}

function generateTagCloud(files, metalsmith, done) {
    var tags = metalsmith.metadata().cloudTags,
        minPercent = 100,
        maxPercent = 200,
        min = null,
        max = null,
        cloud = [];

    var sizes = _.mapValues( tags, function( a) {
        return a.length;
    });

    for ( var key in sizes ) {
        if ( min === null && max === null ) {
            min = sizes[key];
            max = sizes[key];
        } else {
            min = min < sizes[key] ? min : sizes[key];
            max = max > sizes[key] ? max : sizes[key];
        }
    }

    for ( var tag in tags ) {
        var count = sizes[tag];
        cloud.push({
            tagName: tag,
            slug: _s.slugify( tag ),
            size: minPercent + ((max-(max-(count-min)))*(maxPercent-minPercent)/(max-min))
        });
    }

    metalsmith.metadata().cloud = cloud;
    done();
}

/* HTML MINIFIER */

var htmlmin     = require('html-minifier'),
    extname     = require('path').extname;

function htmlMinifier( options ) {
    options = options || {};

    return function( files, metalsmith, done ) {
        for (var file in files) {
            if ('.html' != extname(file)) { continue; }
            files[file].contents = new Buffer(htmlmin.minify(String(files[file].contents), options));
        }

        done();
    }
}

/* IMAGE MINIFIER */

var Imagemin = require('imagemin'),
    async = require('async'),
    os = require('os');

function imageCrusher( options ) {
    options = options || {};

    options = _.defaults( options, {
        interlaced: true,
        optimizationLevel: 6,
        progressive: false
    });

    return function( files, metalsmith, done ) {
        var filtered = _.reject(files, function( file ) {
            return [ '.jpg', '.jpeg', '.png', '.gif', '.svg' ].indexOf(extname(file).toLowerCase()) !== -1;
        });
        async.eachLimit(_.toArray(filtered), os.cpus().length, function (file, next) {
            var imagemin = new Imagemin()
                .src( file.contents )
                .use( Imagemin.gifsicle( { interlaced: options.interlaced } ) )
                .use( Imagemin.jpegtran( { progressive: options.progressive } ) )
                .use( Imagemin.optipng( { optimizationLevel: options.optimizationLevel } ) )
                .use( Imagemin.svgo( { plugins: options.svgoPlugins || [] } ) );

            imagemin.optimize(function( err, data ) {
                if (err) { done(); }

                file.contents = data.contents;

                next();
            });
        }, function( err ) {
            if ( err ) {
                console.log(err);
            }
            done();
        });
    }
}
