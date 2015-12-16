var app = angular.module('noteApp', []);

app.directive('notepad', function(notesFactory) {
  return {
    restrict: 'AE',
    scope: {},
    link: function(scope, elem, attrs) {
      scope.openEditor = function(index){
        scope.editMode = true;
        if (index !== undefined) {
          scope.noteText = notesFactory.get(index).content;
          scope.index = index;
        } else
          scope.noteText = undefined;
      };

      scope.save = function() {
        if (scope.noteText !== "" && scope.noteText !== undefined) {
          var note = {};
          note.title = scope.noteText.length > 50 ? scope.noteText.substring(0, 50) + '. . .' : scope.noteText;
          note.content = scope.noteText;

          console.log('index:'+scope.index);

          if(scope.index == undefined)
          {
              if(localStorage.length > 0)
              {
                 var existingNote = notesFactory.getLastNote();
                 note.id = existingNote.id + 1;
              }
              else{
                 note.id = 1;
              }

              console.log('note id:'+ note.id);
          }
          else{
             note.id =  scope.index;
          }

          scope.notes = notesFactory.put(note);
        }
        scope.restore();
      };

      scope.delete = function(index){
        console.log('Delete Index'+ index);
        var status = confirm('Do you want to Delete?');
        if(status)
          scope.notes = notesFactory.deleteById(index);
      }

      scope.restore = function() {
        scope.editMode = false;
        scope.index = undefined;
        scope.noteText = "";
      };

      var editor = elem.find('#editor');

      scope.restore();

      scope.notes = notesFactory.getAll();

      editor.bind('keyup keydown', function() {
        scope.noteText = editor.text().trim();
      });

    },
    templateUrl: 'templateurl.html'
  };
});

app.factory('notesFactory', function() {
  return {
    put: function(note) {
      localStorage.setItem('note' + note.id, JSON.stringify(note));
      return this.getAll();
    },
    get: function(index) {
      return JSON.parse(localStorage.getItem('note' + index));
    },
    getLastNote: function(){
      var lastNote = [];
      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).indexOf('note') !== -1) {
          var note = localStorage.getItem(localStorage.key(i));
          lastNote = JSON.parse(note);
        }
      }
      return lastNote;
    },
    getAll: function() {
      var notes = [];
      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).indexOf('note') !== -1) {
          var note = localStorage.getItem(localStorage.key(i));
          notes.push(JSON.parse(note));
        }
      }
      return notes;
    },
    deleteById: function(index){
      for (var i = 0; i < localStorage.length; i++) {
          if(localStorage.key(i) == 'note'+index)
            {
              localStorage.removeItem(localStorage.key(i));
              break;
            }
      }
      return this.getAll();
    }
  };
});