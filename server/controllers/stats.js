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
    }
  }
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
      _id: {'op':'$op', 'query':'$query'},
      maxMillis: { $max: '$millis' },
      avgMillis: { $avg: "$millis" },
      minMillis: { $min: "$millis" },
      count: { $sum: 1 },
    }
  };

  var sort = {};
  sort['$sort'] = {};
  sort['$sort'][req.query.sortBy] = -1;

  var limit = {
    $limit: 50
  };
  
  var systemProfileQuery = [
    getMatchCollectionName(req),
    filterOutInsertObjects,
    group,
    sort,
    limit
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
    sortByDate
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
  var query = req.body.query;

  var systemProfileQuery = {
    ns: req.params.collection_name,
    op: operation
  };

  if(query) {
    systemProfileQuery['$where'] = 'tojson(this.query) === tojson(' + query + ')';
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