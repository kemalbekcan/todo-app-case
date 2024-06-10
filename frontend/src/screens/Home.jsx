import React from 'react'
import Task from '../components/Task';
import TaskList from '../components/TaskList'

const Home = () => {
  return (
    <div className='height-100vh flex flex-col justify-between'>
        <div className=''>
            <TaskList />
        </div>
        <div className='mx-10 mb-10'>
            <form className='flex gap-10'>
                <input type='text' placeholder='Message' className='w-100 h-32' />
                <button type='submit'>Send</button>
            </form>
        </div>
    </div>
  )
}

export default Home