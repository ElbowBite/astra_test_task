import React, { useState, useEffect } from 'react';
import moment from 'moment';

import '../../assets/spinner/spinner.css';
import styles from './styles.module.css';

const TaskList = () => {
  const [tList, updateTList] = useState([]);
  const [endTime, updateEndTime] = useState();
  const [timeLeft, updateTimeleft] = useState();

  const timer = React.useRef();

  const taskTypes = {
    time: 'Выйграть три игры, каждую менее чем за 3 минуты',
    kings: 'Выйграть три игры, разложив всех королей',
    tournaments: 'Выйграть пять турниров подряд',
  };

  useEffect(() => {
    fetch('http://sol-tst.herokuapp.com/api/v1/tasks/')
      .then((res) => res.json())
      .then((data) => {
        const neededTasks = data.tasks;
        neededTasks.length = 3;
        updateTList(neededTasks);
        updateEndTime(data.endsAt);
        updateTimeleft(moment(data.endsAt).diff(moment().utc()));
      })
      .catch((err) => alert(err));
  }, []);

  useEffect(() => {
    if (timeLeft) {
      console.log('UseEffect with timer called!');
      timer.current = setInterval(() => {
        updateTimeleft(timeLeft - 1);
      }, 1000);
    }
    return clearInterval(timer.current);
  }, [timeLeft]);

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
        <button
          type="button"
          style={{ opacity: task.progress === 100 ? 1 : 0 }}
          className={styles.Apply}
        >
          Назначить рубашку
        </button>
      </div>
    ));

    console.log(endTime);
    console.log(timeLeft);

    const viewTime = moment.duration(timeLeft, 'seconds')._data;
    return (
      <>
        <div className={styles.Timer}>
          <div className={`${styles.TimerDetails} ${styles.TimerDays}`}>
            <span className={styles.TimerTime}>{viewTime.days}</span>
            <span className={styles.TimerText}>дней</span>
          </div>
          <div className={`${styles.TimerDetails} ${styles.TimerHours}`}>
            <span className={styles.TimerTime}>{viewTime.hours}</span>
            <span className={styles.TimerText}>часов
            </span>
          </div>
          <div className={`${styles.TimerDetails} ${styles.TimerMinutes}`}>
            <span className={styles.TimerTime}>{viewTime.minutes}</span>
            <span className={styles.TimerText}>минут</span>
          </div>
          <div className={`${styles.TimerDetails} ${styles.TimerSeconds}`}>
            <span className={styles.TimerTime}>{viewTime.seconds}</span>
            <span className={styles.TimerText}>секунд</span>
          </div>
        </div>
        <div className={styles.List}>{tasksView}</div>
      </>
    );
  }
  return (
    <>
      <div className={styles.Timer} />
      <div className={styles.List}>
        <div className="lds-ring"><div /><div /><div /><div /></div>
      </div>
    </>
  );
};

export default TaskList;
