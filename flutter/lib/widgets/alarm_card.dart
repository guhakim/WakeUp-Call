import 'package:flutter/material.dart';
import '../models/alarm_model.dart';

class AlarmCard extends StatelessWidget {
  final AlarmModel alarm;
  final VoidCallback onDelete;
  final VoidCallback onTest;

  const AlarmCard({
    super.key,
    required this.alarm,
    required this.onDelete,
    required this.onTest,
  });

  @override
  Widget build(BuildContext context) {
    return Transform.rotate(
      angle: -0.003,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              const Text('😴', style: TextStyle(fontSize: 28)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${alarm.hour.toString().padLeft(2, '0')}:${alarm.minute.toString().padLeft(2, '0')}',
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700),
                    ),
                    Text(alarm.label,
                      style: const TextStyle(fontSize: 14, color: Color(0xFF8C8C8C))),
                  ],
                ),
              ),
              // 테스트 버튼
              GestureDetector(
                onTap: onTest,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF4A228),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFF2D2D2D), width: 1.5),
                  ),
                  child: const Text('▶', style: TextStyle(fontSize: 14)),
                ),
              ),
              const SizedBox(width: 8),
              GestureDetector(
                onTap: onDelete,
                child: const Icon(Icons.close, color: Color(0xFF8C8C8C)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
