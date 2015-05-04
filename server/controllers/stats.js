var express = require('express');
var bodyParser = require("body-parser");
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

require('../models/systemprofile');

var mongoose = require('mongoose');
mongoose.set('debug', true)
var systemProfile = mongoose.model('SystemProfile');

var getMatchCollectionName = function(req) {
  return { 
    $match: { 
      ns: { 
        $eq: req.params.collection_name
      }
    }
  }
};

var filterOutInsertObjects = {
  $project: {
    op: 1,
    millis: 1,
    ts: 1,
    query: {
      $cond: { if: { $eq: [ '$op', 'insert' ] }, then: 'HIDE-INSERT-OBJ', else: '$query' } // group all insert query objects together
    },
    command: 1
  }
};

var limitTo50 = {
  $limit: 50
};

router.get('/collection', function(req, res, next) {

  systemProfile
    .aggregate(
      [
        {
          $group: {
            _id: {'ns':'$ns'}
          }
        },
        {
          $sort: {
            '_id.ns': -1
          }
        }
      ]
    )
    .exec(function(err, result) {
      if (err) {
        console.error('ERROR',err);
      }
      res.send(result);
    });

});

router.get('/operation/:collection_name', function(req, res, next) {

  var group = {
    $group: {
      _id: {'op':'$op', 'query':'$query', 'command':'$command'}
    }
  };

  systemProfile
    .aggregate(
      [
        getMatchCollectionName(req), 
        filterOutInsertObjects,
        group
      ]
    )
    .exec(function(err, result) {
      if (err) {
        console.error('ERROR',err);
      }
      res.send(result);
    });

});

router.get('/operation/:collection_name/top', function(req, res, next) {

  var group = {
    $group: {
      _id: {'op':'$op', 'query':'$query', 'command':'$command'},
      maxMillis: { $max: '$millis' },
      avgMillis: { $avg: "$millis" },
      minMillis: { $min: "$millis" },
      count: { $sum: 1 },
    }
  };

  var sort = {};
  sort['$sort'] = {};
  sort['$sort'][req.query.sortBy] = -1;
  
  var systemProfileQuery = [
    getMatchCollectionName(req),
    filterOutInsertObjects,
    group,
    sort,
    limitTo50
  ];

  systemProfile.aggregate(systemProfileQuery)
      .exec(function(err, result) {
      if (err) {
        console.error('ERROR',err);
      }
      res.send(result);
    });
});

router.get('/operation/:collection_name/recent', function(req, res, next) {

  var groupIntoDays = {
    $group : {
      _id: {
        op : '$op',
        query: '$query',
        command:'$command',
        year : { $year : "$ts" },        
        month : { $month : "$ts" },        
        day : { $dayOfMonth : "$ts" },
        hour: { $hour: "$ts"},
        minute: { $minute: "$ts"}
      },
      maxMillis: { $max: '$millis' },
      avgMillis: { $avg: "$millis" },
      minMillis: { $min: "$millis" },
      count: { $sum: 1 }
    }
  };

  var sortByDate = {
      $sort: {
        '_id.year': -1,
        '_id.month': -1,
        '_id.day': -1,
        '_id.hour': -1,
        '_id.minute': -1
      }
  };

  var operationsGroupedByTimeQuery = [
    getMatchCollectionName(req),
    filterOutInsertObjects,
    groupIntoDays,
    sortByDate,
    limitTo50
  ];

  systemProfile
    .aggregate(operationsGroupedByTimeQuery)
    .exec(function(err, result) {
      if (err) {
        console.error('ERROR',err);
      }
      res.send(result);
    });

});

router.post('/collection/:collection_name/operation', function(req, res, next) {

  var operation = req.body.operation;
  var obj = req.body.obj;

  var systemProfileQuery = {
    ns: req.params.collection_name,
    op: operation
  };

  if(obj) {
    if(operation === 'command') {
      systemProfileQuery['$where'] = 'tojson(this.command) === tojson(' + obj + ')';
    }
    else {
      systemProfileQuery['$where'] = 'tojson(this.query) === tojson(' + obj + ')';
    }
  }

  console.log("Sys Profile Query: ", systemProfileQuery);

  systemProfile
      .find(systemProfileQuery)
      .limit(100)
      .sort({ts: -1})
      .exec(function(err, result) {
        console.log(result);
        if(err) {
          console.log(err);
        }
        res.send(result);
      });
});

module.exports = router;