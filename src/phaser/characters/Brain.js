// import UtilityAi from 'utility-ai';
import actions from '../ai/actions/index';

class Brain {
  constructor (entity) {
    this.entity = entity;
    // this.utility_ai = new UtilityAi;
    
    // this.entity.config.ai.forEach(actionName => {
    //   const actionConfig = actions[actionName];
    //   this.utility_ai.addAction(actionConfig.actionName, action => {
    //     Object.entries(actionConfig.scorers)
    //       .forEach(([scorerName, scorer]) => {
    //         action.score(scorerName, scorer);
    //       });
    //   });
    // });

    this.action = null;
    this.actionName = '';
    this.emoji = '';
  }

  evaluate (data) {
    // evaluate each actions score
    const scores = this.entity.config.ai.map(actionName => {
      return ({
        actionName,
        score: actions[actionName].scorers.reduce((acc, scorer) => acc + scorer(data), 0),
      });
    });

    // find the highest score
    const highscore = scores.reduce((acc, { score }) => score > acc ? score : acc, -Infinity);


    // find all actionNames which match the high score
    const highscoreActionNames = scores.reduce((acc, { actionName, score }) => {
      if (score === highscore) {
        return [
          ...acc,
          actionName,
        ];
      }

      return acc;
    }, []);

    // chooose randomly from array of high scoring actionNames
    const nextActionName = highscoreActionNames[Math.floor(Math.random() * highscoreActionNames.length)];

    return nextActionName;

    // return this.utility_ai.evaluate(data);
  }

  // start (actionName) {
  //   this.action = actions[actionName].create(this.entity);
  // }

  update () {
    if (!this.action) {
      const actionName = this.evaluate({ entity: this.entity });
      // console.log(`ai start`, actionName);
      this.actionName = actionName;
      this.emoji = actions[actionName].emoji;
      this.action = actions[actionName].create(this.entity).finally(() => {
        // console.log('ai complete', actionName);
        this.actionName = '';
        this.action = null;
        this.emoji = '';
      });
    }
  }
}

export default Brain;
