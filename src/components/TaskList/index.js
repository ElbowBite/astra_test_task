import React, { useState, useEffect } from 'react';
import moment from 'moment';

import '../../assets/spinner/spinner.css';
import styles from './styles.module.css';

const TaskList = () => {
  const [tList, updateTList] = useState([]);
  const [timeLeft, updateTimeleft] = useState();
  const [tasksOpen, updateVisibility] = useState(true);

  const taskTypes = {
    time: 'Выиграть три игры, каждую менее чем за 3 минуты',
    kings: 'Выиграть три игры, разложив всех королей',
    tournaments: 'Выиграть пять турниров подряд',
  };

  useEffect(() => {
    fetch('http://sol-tst.herokuapp.com/api/v1/tasks/')
      .then((res) => res.json())
      .then((data) => {
        const neededTasks = data.tasks;
        neededTasks.length = 3;
        updateTList(neededTasks);
        updateTimeleft(moment(data.endsAt).diff(moment().utc()));
      })
      .catch((err) => alert(err));
  }, []);

  const handleClick = () => {
    updateVisibility('none');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateTimeleft(timeLeft - 1000);
    }, 1000);
    return clearInterval(timer);
  });

  if (timeLeft) {
    const tasksView = tList.map((task) => (
      <div key={task.type} className={styles.Task}>
        <img alt="" className={styles.Image} src={require(`../../assets/images/task-${task.type}.png`)} />
        <div className={styles.Details}>
          <span className={styles.Text}>{taskTypes[task.type]}</span>
          <div className={styles.ProgressBar}>
            <span style={{ width: `${task.progress}%` }} />
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            style={{ opacity: task.progress === 100 ? 1 : 0 }}
            className={styles.Apply}
            onClick={handleClick}
          >
            Назначить рубашку
          </button>
        </div>
      </div>
    ));

    const viewTime = moment.duration(timeLeft)._data;
    return (
      <div style={{ display: tasksOpen }}>
        <div className={styles.Timer}>
          <div className={`${styles.TimerDetails} ${styles.TimerDays}`}>
            <span className={styles.TimerTime}>{viewTime.days} :</span>
            <span className={styles.TimerText}>дней</span>
          </div>
          <div className={`${styles.TimerDetails} ${styles.TimerHours}`}>
            <span className={styles.TimerTime}>{viewTime.hours} :</span>
            <span className={styles.TimerText}>часов
            </span>
          </div>
          <div className={`${styles.TimerDetails} ${styles.TimerMinutes}`}>
            <span className={styles.TimerTime}>{viewTime.minutes} :</span>
            <span className={styles.TimerText}>минут</span>
          </div>
          <div className={`${styles.TimerDetails} ${styles.TimerSeconds}`}>
            <span className={styles.TimerTime}>{viewTime.seconds}</span>
            <span className={styles.TimerText}>секунд</span>
          </div>
        </div>
        <div className={styles.List}>{tasksView}</div>
      </div>
    );
  }
  return (
    <>
      <div className={styles.Timer} />
      <div className={styles.List}>
        <div className="spinnerContainer">
          <div className="lds-ring"><div /><div /><div /><div /></div>
        </div>
      </div>
    </>
  );
};

export default TaskList;
