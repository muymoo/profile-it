var shell = require('shelljs');

var svgMaker = {};

var updateLastSvg = function(fileName) {
	shell.cat('public/target/' + fileName).to('public/target/last.svg');
};

svgMaker.createSvg = function(stacksFileName, svgFileName) {
    console.info('Completed profiling. Processing results...');
    
    // We need to change into the tools directory because the stackcollapse.pl only works if it is running against a file in its directory
    shell.cd('./tools');
    shell.exec('./stackcollapse.pl ' + stacksFileName +' | ./flamegraph.pl --width=1000 > ../public/target/' + svgFileName);
    // Reset the current working directory 
    shell.cd('..');

    // Cache a copy for later use
    updateLastSvg(svgFileName);

    console.info('Completed processing results. Created SVG.');
};

exports = module.exports = svgMaker;