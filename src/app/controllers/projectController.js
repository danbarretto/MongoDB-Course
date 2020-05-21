const express = require('express')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

const Project = require('../models/project')
const Task = require('../models/task')

router.use(authMiddleware)

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate(['user', 'tasks'])

    return res.send({ projects })
  } catch (err) {
    res.send({ error: 'Error loading projects' })
  }
})

router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate([
      'user',
      'tasks',
    ])

    return res.send({ project })
  } catch (err) {
    res.send({ error: 'Error loading projects' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, description, tasks } = req.body

    const project = await Project.create({
      title,
      description,
      user: req.userId,
    })

    await Promise.all(
      tasks.map(async (task) => {
        const projetcTask = new Task({ ...task, project: project._id })

        await projetcTask.save()
        project.tasks.push(projetcTask)
      })
    )

    await project.save()

    return res.send({ project })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: 'Error creating new project!' })
  }
})

router.put('/:projectId', async (req, res) => {
  try {
    const { title, description, tasks } = req.body

    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        title,
        description,
      },
      { new: true }
    )

    project.tasks = []
    await Task.remove({ project: project._id })

    await Promise.all(
      tasks.map(async (task) => {
        const projetcTask = new Task({ ...task, project: project._id })

        await projetcTask.save()
        project.tasks.push(projetcTask)
      })
    )

    await project.save()

    return res.send({ project })
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: 'Error updating project!' })
  }
})

router.delete('/:projectId', async (req, res) => {
  try {
    const project = await Project.findByIdAndRemove(
      req.params.projectId
    ).populate('user')

    return res.sendStatus(200)
  } catch (err) {
    res.send({ error: 'Error loading projects' })
  }
})

module.exports = (app) => app.use('/projects', router)
